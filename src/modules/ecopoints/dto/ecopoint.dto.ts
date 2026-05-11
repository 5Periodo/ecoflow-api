import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEcopointDto {
  @ApiProperty({ 
    description: 'Nome ou identificação breve do ponto de coleta',
    example: 'Ponto de Coleta - Bloco A' 
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ 
    description: 'Localização física detalhada dentro do condomínio',
    example: 'Térreo, ao lado da portaria' 
  })
  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @ApiProperty({ 
    description: 'Hash único que será impresso no QR Code físico para identificação deste ponto',
    example: 'qr_hash_123' 
  })
  @IsString()
  @IsNotEmpty()
  qrCodeHash: string;
}
