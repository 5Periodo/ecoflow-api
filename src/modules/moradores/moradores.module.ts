import { Module } from '@nestjs/common';
import { MoradoresService } from './moradores.service';
import { MoradoresController } from './moradores.controller';

@Module({
  providers: [MoradoresService],
  controllers: [MoradoresController]
})
export class MoradoresModule {}
