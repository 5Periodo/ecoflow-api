import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ecoflow_super_secret_jwt_key',
    });
  }

  async validate(payload: any) {
    if (payload.type === 'admin') {
      const user = await this.prisma.usuario.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return { id: user.id, type: 'admin', role: user.role, condominioId: user.condominioId };
    } else if (payload.type === 'morador') {
      const morador = await this.prisma.morador.findUnique({ where: { id: payload.sub } });
      if (!morador) throw new UnauthorizedException();
      const ap = await this.prisma.apartamento.findUnique({ where: { id: morador.apartamentoId } });
      return { id: morador.id, type: 'morador', apartamentoId: morador.apartamentoId, condominioId: ap?.condominioId };
    }
    throw new UnauthorizedException();
  }
}
