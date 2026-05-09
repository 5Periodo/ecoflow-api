import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEcopointDto {
  @ApiProperty({ example: 'Ponto de Coleta - Bloco A' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 'Térreo, ao lado da portaria' })
  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @ApiProperty({ example: 'qr_hash_123' })
  @IsString()
  @IsNotEmpty()
  qrCodeHash: string;
}
