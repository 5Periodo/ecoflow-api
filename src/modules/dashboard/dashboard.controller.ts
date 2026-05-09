import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard (Síndico)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas gerais do condomínio: KG, coletas, apartamentos, ranking, meta (Resumo)' })
  getMetrics(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.dashboardService.getDashboardMetrics(user.condominioId);
  }

  @Get('historico')
  @ApiOperation({ summary: 'Histórico completo de coletas do condomínio com filtros (Síndico)' })
  getHistorico(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.dashboardService.getHistoricoCondominio(user.condominioId);
  }

  @Get('apartamentos')
  @ApiOperation({ summary: 'Visão por apartamento: coletas, KG, status de engajamento no mês (Síndico)' })
  getApartamentos(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.dashboardService.getApartamentosMetrics(user.condominioId);
  }
}
