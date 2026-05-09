import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ArrayMaxSize } from 'class-validator';
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

  @ApiProperty({ required: false, description: 'URLs das fotos do descarte (máximo 3)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  @IsOptional()
  fotoUrls?: string[];
}
