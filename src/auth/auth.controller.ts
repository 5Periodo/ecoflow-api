import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginAdminResponseDto, LoginMoradorResponseDto } from './dto/auth-response.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  @ApiOperation({ 
    summary: 'Login para síndicos e administradores',
    description: 'Autentica um usuário administrativo e retorna um token JWT para acesso às rotas protegidas.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Login realizado com sucesso', 
    type: LoginAdminResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciais inválidas' 
  })
  loginAdmin(@Body() dto: LoginDto): Promise<LoginAdminResponseDto> {
    return this.authService.loginAdmin(dto);
  }

  @Post('login/morador')
  @ApiOperation({ 
    summary: 'Login para moradores (App Mobile)',
    description: 'Autentica um morador e retorna um token JWT para acesso às funcionalidades do aplicativo.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Login realizado com sucesso', 
    type: LoginMoradorResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciais inválidas' 
  })
  loginMorador(@Body() dto: LoginDto): Promise<LoginMoradorResponseDto> {
    return this.authService.loginMorador(dto);
  }
}
