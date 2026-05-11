import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDescarteDto {
  @ApiProperty({ 
    description: 'Hash único do QR Code gerado pelo morador',
    example: 'hash_do_qr_code' 
  })
  @IsString()
  @IsNotEmpty()
  qrCodeHash: string;

  @ApiProperty({ 
    description: 'ID da categoria de material (Papel, Plástico, Vidro, etc.)',
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  categoriaMaterialId: number;

  @ApiProperty({ 
    description: 'Peso do material descartado em quilogramas (kg)',
    example: 2.5 
  })
  @IsNumber()
  @Min(0.1)
  pesoKg: number;

  @ApiProperty({ 
    description: 'Observações adicionais sobre o descarte',
    required: false,
    example: 'Papelão dobrado' 
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({ 
    description: 'URLs das fotos do descarte (máximo 3 fotos)',
    required: false, 
    type: [String] 
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  @IsOptional()
  fotoUrls?: string[];
}
