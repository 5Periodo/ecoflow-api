import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDescarteDto {
  @ApiProperty({ example: 'hash_do_qr_code' })
  @IsString()
  @IsNotEmpty()
  qrCodeHash: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  categoriaMaterialId: number;

  @ApiProperty({ example: 2.5, description: 'Peso em KG' })
  @IsNumber()
  @Min(0.1)
  pesoKg: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
