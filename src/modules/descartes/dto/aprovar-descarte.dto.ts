import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AprovarDescarteDto {
  @ApiProperty({ 
    enum: ['APROVADO', 'NEGADO'],
    description: 'Novo status do descarte após avaliação do síndico' 
  })
  @IsIn(['APROVADO', 'NEGADO'])
  status: 'APROVADO' | 'NEGADO';

  @ApiProperty({ 
    required: false,
    description: 'Quantidade de pontos a serem atribuídos ao morador por este descarte. Se não enviado, será calculado com base no peso e categoria.',
    example: 10 
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  pontosAtribuidos?: number;
}
