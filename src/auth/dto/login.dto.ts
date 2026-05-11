import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@ecoflow.com',
    description: 'E-mail cadastrado do usuário (Síndico ou Morador)' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '123456',
    description: 'Senha de acesso (mínimo 6 caracteres)' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;
}
