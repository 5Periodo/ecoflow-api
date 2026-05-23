import { ApiProperty } from '@nestjs/swagger';

export class RankingItemResponseDto {
  @ApiProperty()
  posicao!: number;

  @ApiProperty({ required: false, nullable: true })
  apartamentoNumero?: string;

  @ApiProperty()
  moradorNome!: string;

  @ApiProperty()
  totalKg!: number;

  @ApiProperty()
  coletas!: number;
}
