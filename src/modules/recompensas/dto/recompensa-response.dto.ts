import { ApiProperty } from '@nestjs/swagger';
import { TipoRecompensa, StatusRecompensa } from '@prisma/client';

export class RecompensaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  condominioId: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  custoPontos: number;

  @ApiProperty({ enum: TipoRecompensa })
  tipo: TipoRecompensa;

  @ApiProperty({ required: false })
  valorDesconto?: number;

  @ApiProperty()
  quantidadeDisponivel: number;

  @ApiProperty({ required: false })
  validade?: Date;

  @ApiProperty({ enum: StatusRecompensa })
  status: StatusRecompensa;

  @ApiProperty()
  createdAt: Date;
}

class MoradorMinimalResponse {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  apartamento: { numero: string; bloco: string };
}

class RecompensaMinimalResponse {
  @ApiProperty()
  titulo: string;

  @ApiProperty({ enum: TipoRecompensa })
  tipo: TipoRecompensa;
}

export class ResgateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  moradorId: string;

  @ApiProperty()
  recompensaId: string;

  @ApiProperty()
  codigoCupom: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  resgatadoEm: Date;

  @ApiProperty({ required: false })
  utilizadoEm?: Date;

  @ApiProperty({ type: MoradorMinimalResponse })
  morador: MoradorMinimalResponse;

  @ApiProperty({ type: RecompensaMinimalResponse })
  recompensa: RecompensaMinimalResponse;
}
