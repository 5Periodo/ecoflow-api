import { Controller, ForbiddenException, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { DashboardMetricsResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard (Síndico)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ 
    summary: 'Métricas gerais do condomínio',
    description: 'Retorna um resumo das métricas principais do condomínio, incluindo KG total, coletas, engajamento e ranking.' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Métricas retornadas com sucesso', 
    type: DashboardMetricsResponseDto 
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  getMetrics(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.dashboardService.getDashboardMetrics(user.condominioId);
  }

  @Get('historico')
  @ApiOperation({ 
    summary: 'Histórico completo de coletas',
    description: 'Retorna o histórico detalhado de todas as coletas realizadas no condomínio para visualização em gráficos.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Histórico retornado com sucesso' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  getHistorico(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.dashboardService.getHistoricoCondominio(user.condominioId);
  }

  @Get('apartamentos')
  @ApiOperation({ 
    summary: 'Visão por apartamento',
    description: 'Retorna métricas de engajamento e volume de descarte segmentadas por cada apartamento do condomínio.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Métricas por apartamento retornadas com sucesso' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  getApartamentos(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.dashboardService.getApartamentosMetrics(user.condominioId);
  }
}
