import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { DescartesService } from './descartes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { AprovarDescarteDto } from './dto/aprovar-descarte.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { DescarteResponseDto } from './dto/descarte-response.dto';

@ApiTags('Descartes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('descartes')
export class DescartesController {
  constructor(private readonly descartesService: DescartesService) {}

  // ─── Morador ─────────────────────────────────────────────────────────────────

  @Post('registrar')
  @ApiOperation({ 
    summary: 'Registra um descarte via QR Code (Morador App)',
    description: 'Envia os dados de um novo descarte para avaliação do síndico. Requer um QR Code válido gerado no app.' 
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Descarte registrado com sucesso' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Apenas moradores podem registrar descartes' })
  registrar(@CurrentUser() user: any, @Body() dto: CreateDescarteDto) {
    if (user.type !== 'morador') throw new ForbiddenException('Apenas moradores podem registrar descartes');
    return this.descartesService.registrarDescarte(user.id, dto);
  }

  @Get('historico')
  @ApiOperation({ 
    summary: 'Histórico de descartes do morador logado',
    description: 'Retorna a lista completa de descartes realizados pelo morador, incluindo status e pontos ganhos.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Histórico retornado com sucesso', type: [DescarteResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao morador logado' })
  historico(@CurrentUser() user: any) {
    if (user.type !== 'morador') throw new ForbiddenException('Acesso restrito ao morador logado');
    return this.descartesService.getHistorico(user.id);
  }

  // ─── Síndico ──────────────────────────────────────────────────────────────────

  @Get('pendentes')
  @ApiOperation({ 
    summary: 'Lista descartes aguardando aprovação do síndico',
    description: 'Retorna todos os descartes com status PENDENTE do condomínio para conferência e pontuação.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de pendentes retornada com sucesso', type: [DescarteResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  pendentes(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.descartesService.listarDescartesPendentes(user.condominioId);
  }

  @Get('todos')
  @ApiOperation({ 
    summary: 'Lista todos os descartes do condomínio (Síndico)',
    description: 'Retorna o histórico completo de descartes do condomínio, independente do status.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista completa retornada com sucesso', type: [DescarteResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  todos(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.descartesService.listarTodosDescartes(user.condominioId);
  }

  @Patch(':id/aprovar')
  @ApiOperation({ 
    summary: 'Aprova ou nega um descarte pendente (Síndico)',
    description: 'Altera o status de um descarte e atribui a pontuação final ao morador.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Descarte processado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Descarte não encontrado' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  aprovar(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: AprovarDescarteDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.descartesService.aprovarDescarte(id, user.condominioId, dto);
  }
}
