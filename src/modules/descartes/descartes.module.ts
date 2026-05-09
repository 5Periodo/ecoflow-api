import { Module } from '@nestjs/common';
import { DescartesService } from './descartes.service';
import { DescartesController } from './descartes.controller';

@Module({
  providers: [DescartesService],
  controllers: [DescartesController]
})
export class DescartesModule {}
