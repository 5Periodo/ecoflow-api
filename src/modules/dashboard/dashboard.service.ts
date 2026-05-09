import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(condominioId: string) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // 1. Total Reciclado & Coletas Registradas (Soma de todos os descartes do condomínio)
    const agregacao = await this.prisma.registroDescarte.aggregate({
      where: { apartamento: { condominioId } },
      _sum: { pesoKg: true },
      _count: { id: true },
    });
    
    const totalRecicladoKg = agregacao._sum.pesoKg ? Number(agregacao._sum.pesoKg) : 0;
    const coletasRegistradas = agregacao._count.id || 0;

    // 2. Apartamentos Ativos e Inativos (neste mês)
    const totalApartamentos = await this.prisma.apartamento.count({
      where: { condominioId }
    });

    const aptosAtivosGroup = await this.prisma.registroDescarte.groupBy({
      by: ['apartamentoId'],
      where: {
        apartamento: { condominioId },
        dataColeta: { gte: inicioMes }
      }
    });

    const apartamentosAtivos = aptosAtivosGroup.length;
    const apartamentosInativos = totalApartamentos - apartamentosAtivos;
    const mediaPorApartamento = apartamentosAtivos > 0 ? (totalRecicladoKg / apartamentosAtivos).toFixed(1) : 0;

    // 3. Materiais Coletados (Total do Condomínio kg agrupado por material)
    const materiaisGroup = await this.prisma.registroDescarte.groupBy({
      by: ['categoriaMaterialId'],
      _sum: { pesoKg: true },
      where: { apartamento: { condominioId } }
    });

    const categorias = await this.prisma.categoriaMaterial.findMany();
    const materiaisColetados = categorias.map(cat => {
      const group = materiaisGroup.find(g => g.categoriaMaterialId === cat.id);
      return {
        nome: cat.nome,
        totalKg: group && group._sum.pesoKg ? Number(group._sum.pesoKg) : 0
      };
    });

    // 4. Meta do Mês
    const metaMensal = await this.prisma.metaMensal.findFirst({
      where: { condominioId, mes: hoje.getMonth() + 1, ano: hoje.getFullYear() }
    });

    // 5. Ranking Básico (Baseado em KG neste mês)
    const rankingMensal = await this.prisma.registroDescarte.groupBy({
      by: ['apartamentoId'],
      _sum: { pesoKg: true },
      _count: { id: true },
      where: {
        apartamento: { condominioId },
        dataColeta: { gte: inicioMes }
      },
      orderBy: { _sum: { pesoKg: 'desc' } }
    });

    const rankingDetails = await Promise.all(
      rankingMensal.map(async (rank, index) => {
        const ap = await this.prisma.apartamento.findUnique({ 
          where: { id: rank.apartamentoId },
          include: { moradores: { take: 1 } } // Pega o 1º morador p/ exibir nome (MVP)
        });
        return {
          posicao: index + 1,
          apartamentoNumero: ap?.numero,
          moradorNome: ap?.moradores[0]?.nome || 'Não identificado',
          totalKg: rank._sum.pesoKg ? Number(rank._sum.pesoKg) : 0,
          coletas: rank._count.id
        };
      })
    );

    return {
      resumo: {
        totalRecicladoKg,
        coletasRegistradas,
        apartamentosAtivos,
        apartamentosInativos,
        mediaPorApartamento: Number(mediaPorApartamento),
        metaDoMes: metaMensal ? {
          metaKg: Number(metaMensal.metaKg),
          realizadoKg: Number(metaMensal.realizadoKg),
          percentual: (Number(metaMensal.realizadoKg) / Number(metaMensal.metaKg)) * 100
        } : null
      },
      materiaisColetados,
      rankingMensal: rankingDetails
    };
  }

  async getHistoricoCondominio(condominioId: string) {
    return this.prisma.registroDescarte.findMany({
      where: { apartamento: { condominioId } },
      include: {
        categoriaMaterial: true,
        apartamento: {
          include: { moradores: { take: 1 } }
        }
      },
      orderBy: { dataColeta: 'desc' },
      take: 50,
    });
  }

  async getApartamentosMetrics(condominioId: string) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const apartamentos = await this.prisma.apartamento.findMany({
      where: { condominioId },
      include: { moradores: { take: 1 } }
    });

    const rankingMensal = await this.prisma.registroDescarte.groupBy({
      by: ['apartamentoId'],
      _sum: { pesoKg: true },
      _count: { id: true },
      where: {
        apartamento: { condominioId },
        dataColeta: { gte: inicioMes }
      }
    });

    return apartamentos.map(ap => {
      const stats = rankingMensal.find(r => r.apartamentoId === ap.id);
      return {
        id: ap.id,
        numero: ap.numero,
        bloco: ap.bloco,
        moradorNome: ap.moradores[0]?.nome || 'Não identificado',
        status: stats ? 'Ativo' : 'Inativo',
        totalColetas: stats?._count.id || 0,
        totalKg: stats?._sum.pesoKg ? Number(stats._sum.pesoKg) : 0,
        ultimaColeta: null // Simplificação para o MVP
      };
    });
  }
}
