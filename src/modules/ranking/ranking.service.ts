import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async getRankingMensal(condominioId: string) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const rankingMensal = await this.prisma.registroDescarte.groupBy({
      by: ['apartamentoId'],
      _sum: { pesoKg: true },
      _count: { id: true },
      where: {
        apartamento: { condominioId },
        dataColeta: { gte: inicioMes },
      },
      orderBy: { _sum: { pesoKg: 'desc' } },
    });

    const rankingDetalhado = [];

    for (const [index, rank] of rankingMensal.entries()) {
      const apartamento = await this.prisma.apartamento.findUnique({
        where: { id: rank.apartamentoId },
        include: {
          moradores: {
            take: 1,
            select: {
              nome: true,
              pontosTotal: true,
            },
          },
        },
      });

      rankingDetalhado.push({
        posicao: index + 1,
        apartamentoNumero: apartamento?.numero,
        moradorNome: apartamento?.moradores[0]?.nome || 'Não identificado',
        pontosTotal: apartamento?.moradores[0]?.pontosTotal || 0,
        totalKg: rank._sum.pesoKg ? Number(rank._sum.pesoKg) : 0,
        coletas: rank._count.id,
      });
    }

    return rankingDetalhado;
  }
}
