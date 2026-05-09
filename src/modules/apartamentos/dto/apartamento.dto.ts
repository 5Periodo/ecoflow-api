import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApartamentoDto {
  @ApiProperty({ example: '305' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ example: 'A', required: false })
  @IsString()
  @IsOptional()
  bloco?: string;
}
