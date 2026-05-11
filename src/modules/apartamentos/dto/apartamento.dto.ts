import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApartamentoDto {
  @ApiProperty({ 
    description: 'Número do apartamento',
    example: '305' 
  })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ 
    description: 'Bloco ou torre (opcional)',
    example: 'A', 
    required: false 
  })
  @IsString()
  @IsOptional()
  bloco?: string;
}
