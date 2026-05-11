import { ApiProperty } from '@nestjs/swagger';

export class CategoriaMaterialResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Nome do material', example: 'Plástico' })
  nome: string;

  @ApiProperty({ description: 'Multiplicador de pontos por kg', example: 10 })
  multiplicadorPontos: number;

  @ApiProperty({ description: 'Ícone representativo', example: 'plastic' })
  icone: string;

  @ApiProperty({ description: 'Cor em formato HEX', example: '#3498db' })
  cor: string;
}
