import { Module } from '@nestjs/common';
import { CategoriasMaterialService } from './categorias-material.service';
import { CategoriasMaterialController } from './categorias-material.controller';

@Module({
  providers: [CategoriasMaterialService],
  controllers: [CategoriasMaterialController]
})
export class CategoriasMaterialModule {}
