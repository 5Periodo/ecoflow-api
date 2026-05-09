import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDescarteDto } from './dto/create-descarte.dto';

@Injectable()
export class DescartesService {
  constructor(private prisma: PrismaService) {}

  async registrarDescarte(moradorId: string, dto: CreateDescarteDto) {
    // 1. Validar Morador
    const morador = await this.prisma.morador.findUnique({
      where: { id: moradorId },
      include: { apartamento: true },
    });
    if (!morador) throw new NotFoundException('Morador não encontrado');

    const condominioId = morador.apartamento.condominioId;

    // 2. Validar Ecopoint via QR Code hash
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

    // 3. Validar Categoria Material
    const categoria = await this.prisma.categoriaMaterial.findUnique({
      where: { id: dto.categoriaMaterialId },
    });
    if (!categoria) throw new NotFoundException('Categoria de material não encontrada');

    // 4. Calcular pontos: peso (kg) × pontos_por_kg da categoria
    const pontosGerados = Math.floor(Number(dto.pesoKg) * categoria.pontosPorKg);

    // 5. Transação atômica: registra descarte + atualiza saldo + atualiza meta mensal
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
        },
      });

      // Atualiza saldo de pontos do morador
      const moradorAtualizado = await tx.morador.update({
        where: { id: moradorId },
        data: { pontosTotal: { increment: pontosGerados } },
      });

      // Atualiza nível do morador conforme pontos acumulados
      const novoNivel = await tx.nivel.findFirst({
        where: { pontosMinimos: { lte: moradorAtualizado.pontosTotal } },
        orderBy: { pontosMinimos: 'desc' },
      });
      if (novoNivel && novoNivel.id !== moradorAtualizado.nivelAtual) {
        await tx.morador.update({
          where: { id: moradorId },
          data: { nivelAtual: novoNivel.id },
        });
      }

      // Atualiza realizado_kg da meta mensal (se existir)
      const hoje = new Date();
      const metaMensal = await tx.metaMensal.findFirst({
        where: { condominioId, mes: hoje.getMonth() + 1, ano: hoje.getFullYear() },
      });
      if (metaMensal) {
        const novoRealizado = Number(metaMensal.realizadoKg) + Number(dto.pesoKg);
        const novoStatus = novoRealizado >= Number(metaMensal.metaKg) ? 'ATINGIDA' : 'EM_ANDAMENTO';
        await tx.metaMensal.update({
          where: { id: metaMensal.id },
          data: { realizadoKg: { increment: dto.pesoKg }, status: novoStatus },
        });
      }

      return registro;
    });

    return {
      message: 'Descarte registrado com sucesso!',
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
}
