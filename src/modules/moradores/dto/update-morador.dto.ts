import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMoradorDto {
  @ApiProperty({
    description: 'Novo nome do morador',
    example: 'João Silva Atualizado',
    required: false,
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    description: 'Nova senha de acesso (mínimo 6 caracteres)',
    example: 'novasenha123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  novaSenha?: string;
}
