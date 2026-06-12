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

class EcopointMinimalResponse {
  @ApiProperty()
  descricao: string;

  @ApiProperty()
  localizacao: string;
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

  @ApiProperty({ type: EcopointMinimalResponse, required: false })
  ecopoint?: EcopointMinimalResponse;
}
