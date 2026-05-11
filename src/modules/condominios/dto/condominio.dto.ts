import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCondominioDto {
  @ApiProperty({ 
    description: 'Nome fantasia do condomínio',
    example: 'Residencial Solar das Águas' 
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ 
    description: 'Meta mensal de coleta de recicláveis em quilogramas (kg)',
    example: 500 
  })
  @IsNumber()
  @IsNotEmpty()
  metaMensalKg: number;
}
