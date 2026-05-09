import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginAdmin(dto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isMatch = await bcrypt.compare(dto.senha, user.senhaHash);
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: user.id, type: 'admin', role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role, condominioId: user.condominioId },
    };
  }

  async loginMorador(dto: LoginDto) {
    const morador = await this.prisma.morador.findUnique({ where: { email: dto.email } });
    if (!morador) throw new UnauthorizedException('Credenciais inválidas');

    const isMatch = await bcrypt.compare(dto.senha, morador.senhaHash);
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: morador.id, type: 'morador' };
    return {
      access_token: this.jwtService.sign(payload),
      morador: { id: morador.id, nome: morador.nome, email: morador.email, apartamentoId: morador.apartamentoId },
    };
  }
}
