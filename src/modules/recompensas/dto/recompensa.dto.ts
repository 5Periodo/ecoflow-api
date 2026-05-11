import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoRecompensa, StatusRecompensa } from '@prisma/client';

export class CreateRecompensaDto {
  @ApiProperty({ 
    description: 'Título chamativo da recompensa',
    example: '10% de desconto na mensalidade do condomínio' 
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ 
    description: 'Descrição detalhada sobre o que é a recompensa e como utilizá-la',
    example: 'Vale um desconto de 10% na taxa condominial do próximo mês. Não cumulativo.' 
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ 
    description: 'Quantidade de pontos necessária para resgatar esta recompensa',
    example: 500 
  })
  @IsInt()
  @Min(1)
  custoPontos: number;

  @ApiProperty({ 
    enum: TipoRecompensa,
    description: 'Tipo da recompensa (SERVICO, PRODUTO, DESCONTO_TAXA)' 
  })
  @IsEnum(TipoRecompensa)
  tipo: TipoRecompensa;

  @ApiProperty({ 
    required: false,
    description: 'Valor monetário do desconto, se aplicável',
    example: 50.00 
  })
  @IsNumber()
  @IsOptional()
  valorDesconto?: number;

  @ApiProperty({ 
    required: false, 
    default: -1,
    description: 'Quantidade total de itens disponíveis. Use -1 para ilimitado.',
    example: 20 
  })
  @IsInt()
  @IsOptional()
  quantidadeDisponivel?: number;

  @ApiProperty({ 
    required: false,
    description: 'Data limite para o resgate da recompensa (Formato ISO)',
    example: '2024-12-31' 
  })
  @IsString()
  @IsOptional()
  validade?: string;
}

export class UpdateRecompensaDto {
  @ApiProperty({ required: false, example: '15% de desconto na mensalidade' })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ required: false, example: 'Novo desconto de 15% na taxa condominial.' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ required: false, example: 750 })
  @IsInt()
  @Min(1)
  @IsOptional()
  custoPontos?: number;

  @ApiProperty({ enum: TipoRecompensa, required: false })
  @IsEnum(TipoRecompensa)
  @IsOptional()
  tipo?: TipoRecompensa;

  @ApiProperty({ required: false, example: 75.00 })
  @IsNumber()
  @IsOptional()
  valorDesconto?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsInt()
  @IsOptional()
  quantidadeDisponivel?: number;

  @ApiProperty({ required: false, example: '2025-01-01' })
  @IsString()
  @IsOptional()
  validade?: string;

  @ApiProperty({ enum: StatusRecompensa, required: false, description: 'Status atual da recompensa (ATIVA, INATIVA, ENCERRADA)' })
  @IsEnum(StatusRecompensa)
  @IsOptional()
  status?: StatusRecompensa;
}
