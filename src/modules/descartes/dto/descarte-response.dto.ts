import { ApiProperty } from '@nestjs/swagger';

class CategoriaMaterialMinimalResponse {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  icone: string;
}

class MoradorMinimalResponse {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  apartamento: { numero: string; bloco: string };
}

export class DescarteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  moradorId: string;

  @ApiProperty()
  categoriaMaterialId: number;

  @ApiProperty()
  pesoKg: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  pontosGanhos: number;

  @ApiProperty()
  dataColeta: Date;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty({ isArray: true, type: String })
  fotoUrls: string[];

  @ApiProperty({ type: CategoriaMaterialMinimalResponse })
  categoriaMaterial: CategoriaMaterialMinimalResponse;

  @ApiProperty({ type: MoradorMinimalResponse, required: false })
  morador?: MoradorMinimalResponse;

  @ApiProperty({
    type: 'object',
    properties: {
      descricao: { type: 'string' },
      localizacao: { type: 'string' },
    },
    required: false,
  })
  ecopoint?: { descricao: string; localizacao: string };
}
