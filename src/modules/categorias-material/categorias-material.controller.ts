import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { CategoriasMaterialService } from './categorias-material.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CategoriaMaterialResponseDto } from './dto/categoria-material-response.dto';

@ApiTags('Configurações - Materiais')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categorias-material')
export class CategoriasMaterialController {
  constructor(private readonly categoriasMaterialService: CategoriasMaterialService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Lista as categorias de material disponíveis',
    description: 'Retorna todos os tipos de materiais recicláveis suportados pelo sistema e seus respectivos multiplicadores de pontos.' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista retornada com sucesso', 
    type: [CategoriaMaterialResponseDto] 
  })
  findAll() {
    return this.categoriasMaterialService.findAll();
  }
}
