import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MoradoresService } from './moradores.service';
import { CreateMoradorDto } from './dto/morador.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Moradores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('moradores')
export class MoradoresController {
  constructor(private readonly moradoresService: MoradoresService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um morador no condomínio (Síndico)' })
  create(@CurrentUser() user: any, @Body() dto: CreateMoradorDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.moradoresService.create(user.condominioId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os moradores do condomínio (Síndico)' })
  findAll(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.moradoresService.findAll(user.condominioId);
  }

  @Get('meu-perfil')
  @ApiOperation({ summary: 'Retorna o perfil completo do morador logado (App Mobile)' })
  meuPerfil(@CurrentUser() user: any) {
    if (user.type !== 'morador') throw new ForbiddenException('Rota exclusiva para moradores');
    return this.moradoresService.getMeuPerfil(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de um morador específico (Síndico)' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.moradoresService.findOne(id, user.condominioId);
  }
}
