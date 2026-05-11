import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { CreateEcopointDto } from './dto/ecopoint.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Ecopoints (Pontos de Coleta)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ecopoints')
export class EcopointsController {
  constructor(private readonly ecopointsService: EcopointsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Cadastra um novo Ecopoint no condomínio (Síndico)',
    description: 'Cria um novo ponto de coleta físico. O QR Code Hash deve ser único para identificação no momento do descarte.' 
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Ecopoint cadastrado com sucesso' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  create(@CurrentUser() user: any, @Body() dto: CreateEcopointDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.ecopointsService.create(user.condominioId, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lista todos os Ecopoints do condomínio',
    description: 'Retorna a lista de pontos de coleta cadastrados no condomínio logado.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista retornada com sucesso' })
  findAll(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.ecopointsService.findAll(user.condominioId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Busca detalhes de um Ecopoint específico',
    description: 'Retorna os detalhes de um ponto de coleta pelo seu ID.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ecopoint encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ecopoint não encontrado' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.ecopointsService.findOne(id, user.condominioId);
  }
}
