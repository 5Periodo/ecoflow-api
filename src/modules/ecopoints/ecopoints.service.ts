import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEcopointDto } from './dto/ecopoint.dto';

@Injectable()
export class EcopointsService {
  constructor(private prisma: PrismaService) {}

  async create(condominioId: string, dto: CreateEcopointDto) {
    const hashExist = await this.prisma.ecopoint.findUnique({ where: { qrCodeHash: dto.qrCodeHash } });
    if (hashExist) throw new BadRequestException('QR Code já está cadastrado em outro ecopoint');

    return this.prisma.ecopoint.create({
      data: {
        descricao: dto.descricao,
        localizacao: dto.localizacao,
        qrCodeHash: dto.qrCodeHash,
        condominioId,
      },
    });
  }

  async findAll(condominioId: string) {
    return this.prisma.ecopoint.findMany({
      where: { condominioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, condominioId: string) {
    const ecopoint = await this.prisma.ecopoint.findUnique({ where: { id } });
    if (!ecopoint || ecopoint.condominioId !== condominioId) {
      throw new NotFoundException('Ecopoint não encontrado neste condomínio');
    }
    return ecopoint;
  }
}
