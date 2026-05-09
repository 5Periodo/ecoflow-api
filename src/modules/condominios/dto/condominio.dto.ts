import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCondominioDto {
  @ApiProperty({ example: 'Condomínio EcoFlow' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @IsNotEmpty()
  metaMensalKg: number;
}
