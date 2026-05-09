import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateRecompensaDto, UpdateRecompensaDto } from './dto/recompensa.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('recompensas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recompensas')
export class RecompensasController {
  constructor(private readonly recompensasService: RecompensasService) {}

  @ApiOperation({ summary: 'Criar recompensa (Síndico)' })
  @Post()
  create(@Request() req: any, @Body() createRecompensaDto: CreateRecompensaDto) {
    return this.recompensasService.create(req.user.condominioId, createRecompensaDto);
  }

  @ApiOperation({ summary: 'Listar todas recompensas' })
  @Get()
  findAll(@Request() req: any) {
    return this.recompensasService.findAll(req.user.condominioId);
  }

  @ApiOperation({ summary: 'Atualizar recompensa (Síndico)' })
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateRecompensaDto: UpdateRecompensaDto) {
    return this.recompensasService.update(id, req.user.condominioId, updateRecompensaDto);
  }

  @ApiOperation({ summary: 'Remover recompensa (Síndico)' })
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.recompensasService.remove(id, req.user.condominioId);
  }

  // --- RESGATES ---

  @ApiOperation({ summary: 'Listar histórico de resgates (Síndico)' })
  @Get('admin/resgates')
  listarResgates(@Request() req: any) {
    return this.recompensasService.listarResgates(req.user.condominioId);
  }

  @ApiOperation({ summary: 'Marcar resgate como utilizado (Síndico)' })
  @Patch('admin/resgates/:id/utilizar')
  utilizarResgate(@Request() req: any, @Param('id') id: string) {
    return this.recompensasService.utilizarResgate(id, req.user.condominioId);
  }
}
