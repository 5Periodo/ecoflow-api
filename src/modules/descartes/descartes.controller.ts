import { Body, Controller, ForbiddenException, Get, Post, UseGuards } from '@nestjs/common';
import { DescartesService } from './descartes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateDescarteDto } from './dto/create-descarte.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Descartes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('descartes')
export class DescartesController {
  constructor(private readonly descartesService: DescartesService) {}

  @Post('registrar')
  @ApiOperation({ summary: 'Registra um descarte via QR Code do Ecopoint (Morador)' })
  registrar(@CurrentUser() user: any, @Body() dto: CreateDescarteDto) {
    if (user.type !== 'morador') throw new ForbiddenException('Apenas moradores podem registrar descartes');
    return this.descartesService.registrarDescarte(user.id, dto);
  }

  @Get('historico')
  @ApiOperation({ summary: 'Histórico de descartes do morador logado (App Mobile)' })
  historico(@CurrentUser() user: any) {
    if (user.type !== 'morador') throw new ForbiddenException('Acesso restrito ao morador logado');
    return this.descartesService.getHistorico(user.id);
  }
}
