import { ApiProperty } from '@nestjs/swagger';

class RankingMorador {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nome: string;
  @ApiProperty()
  pontos: number;
}

export class DashboardMetricsResponseDto {
  @ApiProperty({ description: 'Total de material coletado em KG' })
  totalKg: number;

  @ApiProperty({ description: 'Total de coletas realizadas' })
  totalColetas: number;

  @ApiProperty({ description: 'Total de apartamentos engajados' })
  apartamentosEngajados: number;

  @ApiProperty({ description: 'Meta mensal do condomínio' })
  metaMensalKg: number;

  @ApiProperty({ description: 'Ranking dos 5 moradores com mais pontos', type: [RankingMorador] })
  rankingMoradores: RankingMorador[];
}
