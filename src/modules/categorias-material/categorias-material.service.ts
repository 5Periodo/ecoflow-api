import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Níveis definidos na documentação de gamificação:
// N1 Iniciante: 0–499 pts (×1.0)
// N2 Colaborador: 500–1999 pts (×1.1)
// N3 Expert: 2000–4999 pts (×1.2)
// N4 Guardião: 5000+ pts (×1.5)

@Injectable()
export class CategoriasMaterialService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categoriaMaterial.findMany({
      orderBy: { pontosPorKg: 'desc' },
    });
  }
}
