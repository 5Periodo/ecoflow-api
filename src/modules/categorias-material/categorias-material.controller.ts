import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriasMaterialService } from './categorias-material.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Categorias de Material')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categorias-material')
export class CategoriasMaterialController {
  constructor(private readonly categoriasMaterialService: CategoriasMaterialService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as categorias de material disponíveis e suas pontuações' })
  findAll() {
    return this.categoriasMaterialService.findAll();
  }
}
