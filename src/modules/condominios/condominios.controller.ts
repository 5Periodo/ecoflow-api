import { Body, Controller, Get, Param, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { CondominiosService } from './condominios.service';
import { CreateCondominioDto } from './dto/condominio.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Condomínios')
@Controller('condominios')
export class CondominiosController {
  constructor(private readonly condominiosService: CondominiosService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Cria um novo condomínio (Uso Interno/Admin)',
    description: 'Registra um novo condomínio no sistema. Rota de uso administrativo interno.' 
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Condomínio criado com sucesso' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' })
  create(@Body() dto: CreateCondominioDto) {
    return this.condominiosService.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lista todos os condomínios',
    description: 'Retorna uma lista resumida de todos os condomínios cadastrados.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista retornada com sucesso' })
  findAll() {
    return this.condominiosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Busca os dados de um condomínio específico',
    description: 'Retorna os detalhes completos de um condomínio pelo ID. Requer autenticação.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Condomínio encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Condomínio não encontrado' })
  findOne(@Param('id') id: string) {
    return this.condominiosService.findOne(id);
  }
}
