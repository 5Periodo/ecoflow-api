import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoRecompensa, StatusRecompensa } from '@prisma/client';

export class CreateRecompensaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  custoPontos: number;

  @ApiProperty({ enum: TipoRecompensa })
  @IsEnum(TipoRecompensa)
  tipo: TipoRecompensa;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  valorDesconto?: number;

  @ApiProperty({ required: false, default: -1 })
  @IsInt()
  @IsOptional()
  quantidadeDisponivel?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  validade?: string;
}

export class UpdateRecompensaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  custoPontos?: number;

  @ApiProperty({ enum: TipoRecompensa, required: false })
  @IsEnum(TipoRecompensa)
  @IsOptional()
  tipo?: TipoRecompensa;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  valorDesconto?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  quantidadeDisponivel?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  validade?: string;

  @ApiProperty({ enum: StatusRecompensa, required: false })
  @IsEnum(StatusRecompensa)
  @IsOptional()
  status?: StatusRecompensa;
}
