import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMoradorDto } from './dto/morador.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MoradoresService {
  constructor(private prisma: PrismaService) {}

  async create(condominioId: string, dto: CreateMoradorDto) {
    // Valida se o apartamento pertence ao condomínio do síndico
    const apartamento = await this.prisma.apartamento.findUnique({ where: { id: dto.apartamentoId } });
    if (!apartamento || apartamento.condominioId !== condominioId) {
      throw new BadRequestException('Apartamento inválido para este condomínio');
    }

    // Verifica e-mail único
    const emailExist = await this.prisma.morador.findUnique({ where: { email: dto.email } });
    if (emailExist) throw new BadRequestException('E-mail já está em uso');

    // Garante que o nível 1 existe antes de criar o morador
    await this.prisma.nivel.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nome: 'Iniciante', pontosMinimos: 0, icone: 'iniciante' },
    });

    const senha = dto.senha || 'ecoflow123';
    const senhaHash = await bcrypt.hash(senha, 10);

    const morador = await this.prisma.morador.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        apartamentoId: dto.apartamentoId,
        pontosTotal: 0,
        nivelAtual: 1,
      },
    });

    return { message: 'Morador criado com sucesso', moradorId: morador.id };
  }

  async findAll(condominioId: string) {
    return this.prisma.morador.findMany({
      where: { apartamento: { condominioId } },
      select: {
        id: true,
        nome: true,
        email: true,
        pontosTotal: true,
        nivelAtual: true,
        createdAt: true,
        apartamentoId: true,
        apartamento: { select: { id: true, numero: true, bloco: true } },
        nivel: { select: { nome: true, icone: true } },
      },
    });
  }

  async findOne(id: string, condominioId: string) {
    const morador = await this.prisma.morador.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        pontosTotal: true,
        nivelAtual: true,
        createdAt: true,
        apartamento: { select: { id: true, numero: true, bloco: true, condominioId: true } },
        nivel: { select: { nome: true, icone: true, pontosMinimos: true } },
      },
    });
    if (!morador || morador.apartamento.condominioId !== condominioId) {
      throw new NotFoundException('Morador não encontrado neste condomínio');
    }
    return morador;
  }

  async getMeuPerfil(moradorId: string) {
    const morador = await this.prisma.morador.findUnique({
      where: { id: moradorId },
      select: {
        id: true,
        nome: true,
        email: true,
        pontosTotal: true,
        createdAt: true,
        apartamento: { select: { numero: true, bloco: true } },
        nivel: true,
        descartes: {
          orderBy: { dataColeta: 'desc' },
          take: 5,
          include: { categoriaMaterial: true },
        },
      },
    });
    if (!morador) throw new NotFoundException('Morador não encontrado');

    // Busca próximo nível para mostrar progresso
    const proximoNivel = await this.prisma.nivel.findFirst({
      where: { pontosMinimos: { gt: morador.pontosTotal } },
      orderBy: { pontosMinimos: 'asc' },
    });

    return { ...morador, proximoNivel };
  }
}
