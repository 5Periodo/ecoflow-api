import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecompensaDto, UpdateRecompensaDto } from './dto/recompensa.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RecompensasService {
  constructor(private prisma: PrismaService) {}

  async create(condominioId: string, dto: CreateRecompensaDto) {
    return this.prisma.recompensa.create({
      data: {
        condominioId,
        titulo: dto.titulo,
        descricao: dto.descricao,
        custoPontos: dto.custoPontos,
        tipo: dto.tipo,
        valorDesconto: dto.valorDesconto,
        quantidadeDisponivel: dto.quantidadeDisponivel ?? -1,
        validade: dto.validade ? new Date(dto.validade) : null,
      },
    });
  }

  async findAll(condominioId: string) {
    return this.prisma.recompensa.findMany({
      where: { condominioId },
      orderBy: { status: 'asc' },
    });
  }

  async findOne(id: string, condominioId: string) {
    const recompensa = await this.prisma.recompensa.findUnique({
      where: { id },
    });
    if (!recompensa || recompensa.condominioId !== condominioId) {
      throw new NotFoundException('Recompensa não encontrada neste condomínio');
    }
    return recompensa;
  }

  async update(id: string, condominioId: string, dto: UpdateRecompensaDto) {
    await this.findOne(id, condominioId);
    return this.prisma.recompensa.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        custoPontos: dto.custoPontos,
        tipo: dto.tipo,
        valorDesconto: dto.valorDesconto,
        quantidadeDisponivel: dto.quantidadeDisponivel,
        validade: dto.validade ? new Date(dto.validade) : undefined,
        status: dto.status,
      },
    });
  }

  async remove(id: string, condominioId: string) {
    await this.findOne(id, condominioId);

    const resgatesCount = await this.prisma.resgate.count({
      where: { recompensaId: id },
    });
    if (resgatesCount > 0) {
      // Hard delete not allowed if there are redemptions. Mark as ENCERRADA instead.
      return this.prisma.recompensa.update({
        where: { id },
        data: { status: 'ENCERRADA' },
      });
    }

    return this.prisma.recompensa.delete({ where: { id } });
  }

  // --- RESGATES ---

  async listarResgates(condominioId: string) {
    return this.prisma.resgate.findMany({
      where: { recompensa: { condominioId } },
      include: {
        morador: {
          select: {
            nome: true,
            apartamento: { select: { numero: true, bloco: true } },
          },
        },
        recompensa: { select: { titulo: true, tipo: true } },
      },
      orderBy: { resgatadoEm: 'desc' },
    });
  }

  async utilizarResgate(id: string, condominioId: string) {
    const resgate = await this.prisma.resgate.findUnique({
      where: { id },
      include: { recompensa: true },
    });

    if (!resgate || resgate.recompensa.condominioId !== condominioId) {
      throw new NotFoundException('Resgate não encontrado');
    }
    if (resgate.status !== 'PENDENTE') {
      throw new BadRequestException(`Este resgate já está ${resgate.status}`);
    }

    return this.prisma.resgate.update({
      where: { id },
      data: {
        status: 'UTILIZADO',
        utilizadoEm: new Date(),
      },
    });
  }

  // Future morador feature, but let's implement the service logic now:
  async resgatar(moradorId: string, recompensaId: string) {
    const morador = await this.prisma.morador.findUnique({
      where: { id: moradorId },
    });
    if (!morador) throw new NotFoundException('Morador não encontrado');

    const recompensa = await this.prisma.recompensa.findUnique({
      where: { id: recompensaId },
    });
    if (!recompensa) throw new NotFoundException('Recompensa não encontrada');

    if (recompensa.status !== 'ATIVA') {
      throw new BadRequestException('Esta recompensa não está ativa');
    }

    if (recompensa.validade && new Date() > recompensa.validade) {
      throw new BadRequestException('Recompensa expirada');
    }

    if (
      recompensa.quantidadeDisponivel !== -1 &&
      recompensa.quantidadeDisponivel <= 0
    ) {
      throw new BadRequestException('Recompensa esgotada');
    }

    if (morador.pontosTotal < recompensa.custoPontos) {
      throw new BadRequestException('Pontos insuficientes');
    }

    const codigoCupom = `ECO-${uuidv4().substring(0, 8).toUpperCase()}`;

    return this.prisma.$transaction(async (tx) => {
      // Desconta pontos
      await tx.morador.update({
        where: { id: moradorId },
        data: { pontosTotal: { decrement: recompensa.custoPontos } },
      });

      // Diminui quantidade se for limitada
      if (recompensa.quantidadeDisponivel !== -1) {
        await tx.recompensa.update({
          where: { id: recompensaId },
          data: { quantidadeDisponivel: { decrement: 1 } },
        });
      }

      // Cria resgate
      return tx.resgate.create({
        data: {
          moradorId,
          recompensaId,
          codigoCupom,
        },
      });
    });
  }

  async meuHistoricoResgates(moradorId: string) {
    const morador = await this.prisma.morador.findUnique({
      where: { id: moradorId },
    });
    if (!morador) throw new NotFoundException('Morador não encontrado');

    return this.prisma.resgate.findMany({
      where: { moradorId },
      include: {
        recompensa: { select: { titulo: true, tipo: true, custoPontos: true } },
      },
      orderBy: { resgatadoEm: 'desc' },
    });
  }
}
