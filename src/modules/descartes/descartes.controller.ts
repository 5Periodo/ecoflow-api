import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DescartesService } from './descartes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { AprovarDescarteDto } from './dto/aprovar-descarte.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Descartes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('descartes')
export class DescartesController {
  constructor(private readonly descartesService: DescartesService) {}

  // ─── Morador ─────────────────────────────────────────────────────────────────

  @Post('registrar')
  @ApiOperation({ summary: 'Registra um descarte via QR Code (Morador App)' })
  registrar(@CurrentUser() user: any, @Body() dto: CreateDescarteDto) {
    if (user.type !== 'morador') throw new ForbiddenException('Apenas moradores podem registrar descartes');
    return this.descartesService.registrarDescarte(user.id, dto);
  }

  @Get('historico')
  @ApiOperation({ summary: 'Histórico de descartes do morador logado' })
  historico(@CurrentUser() user: any) {
    if (user.type !== 'morador') throw new ForbiddenException('Acesso restrito ao morador logado');
    return this.descartesService.getHistorico(user.id);
  }

  // ─── Síndico ──────────────────────────────────────────────────────────────────

  @Get('pendentes')
  @ApiOperation({ summary: 'Lista descartes aguardando aprovação do síndico' })
  pendentes(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.descartesService.listarDescartesPendentes(user.condominioId);
  }

  @Get('todos')
  @ApiOperation({ summary: 'Lista todos os descartes do condomínio (Síndico)' })
  todos(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.descartesService.listarTodosDescartes(user.condominioId);
  }

  @Patch(':id/aprovar')
  @ApiOperation({ summary: 'Aprova ou nega um descarte pendente (Síndico)' })
  aprovar(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: AprovarDescarteDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.descartesService.aprovarDescarte(id, user.condominioId, dto);
  }
}
