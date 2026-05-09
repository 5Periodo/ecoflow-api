import { Module } from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { RecompensasController } from './recompensas.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RecompensasService],
  controllers: [RecompensasController]
})
export class RecompensasModule {}
