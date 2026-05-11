import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateRecompensaDto, UpdateRecompensaDto } from './dto/recompensa.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecompensaResponseDto, ResgateResponseDto } from './dto/recompensa-response.dto';

@ApiTags('Recompensas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recompensas')
export class RecompensasController {
  constructor(private readonly recompensasService: RecompensasService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar recompensa (Síndico)',
    description: 'Cria uma nova recompensa que ficará disponível para resgate pelos moradores do condomínio.'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Recompensa criada com sucesso', 
    type: RecompensaResponseDto 
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito' })
  create(@Request() req: any, @Body() createRecompensaDto: CreateRecompensaDto) {
    return this.recompensasService.create(req.user.condominioId, createRecompensaDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas recompensas',
    description: 'Retorna todas as recompensas cadastradas no condomínio do usuário logado.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de recompensas retornada com sucesso', 
    type: [RecompensaResponseDto] 
  })
  findAll(@Request() req: any) {
    return this.recompensasService.findAll(req.user.condominioId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar recompensa (Síndico)',
    description: 'Atualiza os dados de uma recompensa existente.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Recompensa atualizada com sucesso', 
    type: RecompensaResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recompensa não encontrada' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateRecompensaDto: UpdateRecompensaDto) {
    return this.recompensasService.update(id, req.user.condominioId, updateRecompensaDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover recompensa (Síndico)',
    description: 'Remove uma recompensa. Se houver resgates vinculados, ela será marcada como ENCERRADA em vez de excluída.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Recompensa removida ou encerrada com sucesso' 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recompensa não encontrada' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.recompensasService.remove(id, req.user.condominioId);
  }

  // --- RESGATES ---

  @Get('admin/resgates')
  @ApiOperation({ 
    summary: 'Listar histórico de resgates (Síndico)',
    description: 'Retorna todos os resgates realizados pelos moradores do condomínio, com detalhes de quem resgatou.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de resgates retornada com sucesso', 
    type: [ResgateResponseDto] 
  })
  listarResgates(@Request() req: any) {
    return this.recompensasService.listarResgates(req.user.condominioId);
  }

  @Patch('admin/resgates/:id/utilizar')
  @ApiOperation({ 
    summary: 'Marcar resgate como utilizado (Síndico)',
    description: 'Altera o status de um resgate de PENDENTE para UTILIZADO. Geralmente feito no momento da entrega do prêmio.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Status do resgate atualizado com sucesso' 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Resgate já utilizado ou cancelado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Resgate não encontrado' })
  utilizarResgate(@Request() req: any, @Param('id') id: string) {
    return this.recompensasService.utilizarResgate(id, req.user.condominioId);
  }
}
