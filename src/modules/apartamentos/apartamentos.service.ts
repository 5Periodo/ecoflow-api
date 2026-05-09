import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApartamentoDto } from './dto/apartamento.dto';

@Injectable()
export class ApartamentosService {
  constructor(private prisma: PrismaService) {}

  async create(condominioId: string, dto: CreateApartamentoDto) {
    return this.prisma.apartamento.create({
      data: {
        numero: dto.numero,
        bloco: dto.bloco,
        condominioId,
      },
    });
  }

  async findAll(condominioId: string) {
    return this.prisma.apartamento.findMany({
      where: { condominioId },
      include: {
        _count: { select: { moradores: true, descartes: true } },
        moradores: { select: { nome: true }, take: 1 },
      },
      orderBy: { numero: 'asc' },
    });
  }

  async findOne(id: string, condominioId: string) {
    const apartamento = await this.prisma.apartamento.findUnique({
      where: { id },
      include: {
        moradores: { select: { id: true, nome: true, email: true, pontosTotal: true } },
        _count: { select: { descartes: true } },
      },
    });
    if (!apartamento || apartamento.condominioId !== condominioId) {
      throw new NotFoundException('Apartamento não encontrado neste condomínio');
    }
    return apartamento;
  }
}
