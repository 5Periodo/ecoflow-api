import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMoradorDto {
  @ApiProperty({ 
    description: 'ID do apartamento ao qual o morador pertence',
    example: 'uuid-do-apartamento'
  })
  @IsString()
  @IsNotEmpty()
  apartamentoId: string;

  @ApiProperty({ 
    description: 'Nome completo do morador',
    example: 'João Silva'
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ 
    description: 'E-mail do morador (usado para login)',
    example: 'joao.silva@email.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Senha de acesso (mínimo 6 caracteres). Se não enviada, uma padrão pode ser gerada.',
    example: 'senha123',
    required: false
  })
  @IsString()
  @MinLength(6)
  senha?: string;
}
