import { ApiProperty } from '@nestjs/swagger';

class ApartamentoMinimalResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  numero: string;

  @ApiProperty({ required: false })
  bloco?: string;
}

class NivelResponse {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  icone: string;

  @ApiProperty({ required: false })
  pontosMinimos?: number;
}

export class MoradorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  pontosTotal: number;

  @ApiProperty()
  nivelAtual: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ApartamentoMinimalResponse })
  apartamento: ApartamentoMinimalResponse;

  @ApiProperty({ type: NivelResponse })
  nivel: NivelResponse;
}

export class CreateMoradorResponseDto {
  @ApiProperty({ example: 'Morador criado com sucesso' })
  message: string;

  @ApiProperty()
  moradorId: string;
}

export class PerfilMoradorResponseDto extends MoradorResponseDto {
  @ApiProperty({ type: NivelResponse, required: false })
  proximoNivel?: NivelResponse;

  @ApiProperty({ isArray: true, type: Object, description: 'Lista dos últimos 5 descartes' })
  descartes: any[];
}
