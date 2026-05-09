import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCondominioDto } from './dto/condominio.dto';

@Injectable()
export class CondominiosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCondominioDto) {
    return this.prisma.condominio.create({
      data: {
        nome: dto.nome,
        metaMensalKg: dto.metaMensalKg,
      },
    });
  }

  async findAll() {
    return this.prisma.condominio.findMany({
      include: {
        _count: { select: { apartamentos: true, usuarios: true, ecopoints: true } },
      },
    });
  }

  async findOne(id: string) {
    const condominio = await this.prisma.condominio.findUnique({
      where: { id },
      include: {
        _count: { select: { apartamentos: true, usuarios: true, ecopoints: true } },
      },
    });
    if (!condominio) throw new NotFoundException('Condomínio não encontrado');
    return condominio;
  }
}
