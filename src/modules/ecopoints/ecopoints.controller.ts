import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { CreateEcopointDto } from './dto/ecopoint.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Ecopoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ecopoints')
export class EcopointsController {
  constructor(private readonly ecopointsService: EcopointsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um novo Ecopoint (ponto de coleta) no condomínio (Síndico)' })
  create(@CurrentUser() user: any, @Body() dto: CreateEcopointDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.ecopointsService.create(user.condominioId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os Ecopoints do condomínio' })
  findAll(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.ecopointsService.findAll(user.condominioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de um Ecopoint específico' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.ecopointsService.findOne(id, user.condominioId);
  }
}
