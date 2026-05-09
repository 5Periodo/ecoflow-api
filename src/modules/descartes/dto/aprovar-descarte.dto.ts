import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AprovarDescarteDto {
  @ApiProperty({ enum: ['APROVADO', 'NEGADO'] })
  @IsIn(['APROVADO', 'NEGADO'])
  status: 'APROVADO' | 'NEGADO';

  @ApiProperty({ required: false })
  @IsInt()
  @IsPositive()
  @IsOptional()
  pontosAtribuidos?: number;
}
