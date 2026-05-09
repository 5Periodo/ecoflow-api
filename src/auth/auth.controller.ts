import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  @ApiOperation({ summary: 'Login para síndicos e administradores' })
  loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto);
  }

  @Post('login/morador')
  @ApiOperation({ summary: 'Login para moradores (App Mobile)' })
  loginMorador(@Body() dto: LoginDto) {
    return this.authService.loginMorador(dto);
  }
}
