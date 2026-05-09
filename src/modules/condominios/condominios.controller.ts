import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CondominiosService } from './condominios.service';
import { CreateCondominioDto } from './dto/condominio.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Condomínios')
@Controller('condominios')
export class CondominiosController {
  constructor(private readonly condominiosService: CondominiosService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo condomínio (Uso Interno/Admin)' })
  create(@Body() dto: CreateCondominioDto) {
    return this.condominiosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os condomínios' })
  findAll() {
    return this.condominiosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca os dados de um condomínio específico' })
  findOne(@Param('id') id: string) {
    return this.condominiosService.findOne(id);
  }
}
