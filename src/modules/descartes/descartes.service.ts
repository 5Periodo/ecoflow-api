import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { AprovarDescarteDto } from './dto/aprovar-descarte.dto';

@Injectable()
export class DescartesService {
  constructor(private prisma: PrismaService) {}

  async registrarDescarte(moradorId: string, dto: CreateDescarteDto) {
    const morador = await this.prisma.morador.findUnique({
      where: { id: moradorId },
      include: { apartamento: true },
    });
    if (!morador) throw new NotFoundException('Morador não encontrado');

    const condominioId = morador.apartamento.condominioId;

    const ecopoint = await this.prisma.ecopoint.findUnique({
      where: { qrCodeHash: dto.qrCodeHash },
    });
    if (!ecopoint) throw new NotFoundException('QR Code inválido ou Ecopoint não encontrado');
    if (ecopoint.condominioId !== condominioId) {
      throw new ForbiddenException('Ecopoint não pertence ao seu condomínio');
    }
    if (ecopoint.status !== 'ATIVO') {
      throw new BadRequestException(`Ecopoint indisponível (status: ${ecopoint.status})`);
    }

    const categoria = await this.prisma.categoriaMaterial.findUnique({
      where: { id: dto.categoriaMaterialId },
    });
    if (!categoria) throw new NotFoundException('Categoria de material não encontrada');

    const pontosGerados = Math.floor(Number(dto.pesoKg) * categoria.pontosPorKg);

    const result = await this.prisma.$transaction(async (tx) => {
      const registro = await tx.registroDescarte.create({
        data: {
          moradorId,
          apartamentoId: morador.apartamentoId,
          ecopointId: ecopoint.id,
          categoriaMaterialId: categoria.id,
          pesoKg: dto.pesoKg,
          pontosGerados,
          observacoes: dto.observacoes,
          fotoUrl: dto.fotoUrl,
          status: 'PENDENTE',
        },
      });
      return registro;
    });

    return {
      message: 'Descarte registrado! Aguardando aprovação do síndico.',
      pontosGerados,
      registroId: result.id,
    };
  }

  async getHistorico(moradorId: string) {
    return this.prisma.registroDescarte.findMany({
      where: { moradorId },
      include: {
        categoriaMaterial: true,
        ecopoint: { select: { descricao: true, localizacao: true } },
      },
      orderBy: { dataColeta: 'desc' },
      take: 50,
    });
  }

  // ─── Admin endpoints ─────────────────────────────────────────────────────────

  async listarDescartesPendentes(condominioId: string) {
    return this.prisma.registroDescarte.findMany({
      where: {
        status: 'PENDENTE',
        apartamento: { condominioId },
      },
      include: {
        morador: { select: { nome: true, email: true } },
        apartamento: { select: { numero: true, bloco: true } },
        categoriaMaterial: true,
        ecopoint: { select: { descricao: true } },
      },
      orderBy: { dataColeta: 'desc' },
    });
  }

  async listarTodosDescartes(condominioId: string) {
    return this.prisma.registroDescarte.findMany({
      where: { apartamento: { condominioId } },
      include: {
        morador: { select: { nome: true } },
        apartamento: { select: { numero: true, bloco: true } },
        categoriaMaterial: true,
      },
      orderBy: { dataColeta: 'desc' },
      take: 100,
    });
  }

  async aprovarDescarte(id: string, condominioId: string, dto: AprovarDescarteDto) {
    const descarte = await this.prisma.registroDescarte.findUnique({
      where: { id },
      include: { apartamento: true },
    });
    if (!descarte) throw new NotFoundException('Descarte não encontrado');
    if (descarte.apartamento.condominioId !== condominioId) {
      throw new ForbiddenException('Descarte não pertence ao seu condomínio');
    }
    if (descarte.status !== 'PENDENTE') {
      throw new BadRequestException(`Descarte já foi ${descarte.status.toLowerCase()}`);
    }

    const pontosFinais = dto.pontosAtribuidos ?? descarte.pontosGerados;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.registroDescarte.update({
        where: { id },
        data: {
          status: dto.status,
          pontosAtribuidos: pontosFinais,
        },
      });

      if (dto.status === 'APROVADO') {
        // Credita os pontos finais ao morador
        const moradorAtualizado = await tx.morador.update({
          where: { id: descarte.moradorId },
          data: { pontosTotal: { increment: pontosFinais } },
        });

        // Atualiza nível
        const novoNivel = await tx.nivel.findFirst({
          where: { pontosMinimos: { lte: moradorAtualizado.pontosTotal } },
          orderBy: { pontosMinimos: 'desc' },
        });
        if (novoNivel && novoNivel.id !== moradorAtualizado.nivelAtual) {
          await tx.morador.update({
            where: { id: descarte.moradorId },
            data: { nivelAtual: novoNivel.id },
          });
        }

        // Atualiza meta mensal
        const d = descarte.dataColeta;
        const meta = await tx.metaMensal.findFirst({
          where: { condominioId, mes: d.getMonth() + 1, ano: d.getFullYear() },
        });
        if (meta) {
          const novoRealizado = Number(meta.realizadoKg) + Number(descarte.pesoKg);
          await tx.metaMensal.update({
            where: { id: meta.id },
            data: {
              realizadoKg: { increment: descarte.pesoKg },
              status: novoRealizado >= Number(meta.metaKg) ? 'ATINGIDA' : 'EM_ANDAMENTO',
            },
          });
        }
      }

      return { message: `Descarte ${dto.status.toLowerCase()} com sucesso!`, pontosAtribuidos: pontosFinais };
    });
  }
}
