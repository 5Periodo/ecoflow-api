import { Module } from '@nestjs/common';
import { ApartamentosService } from './apartamentos.service';
import { ApartamentosController } from './apartamentos.controller';

@Module({
  providers: [ApartamentosService],
  controllers: [ApartamentosController]
})
export class ApartamentosModule {}
