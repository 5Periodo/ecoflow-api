import { Module } from '@nestjs/common';
import { CondominiosService } from './condominios.service';
import { CondominiosController } from './condominios.controller';

@Module({
  providers: [CondominiosService],
  controllers: [CondominiosController]
})
export class CondominiosModule {}
