import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { ApartamentosService } from './apartamentos.service';
import { CreateApartamentoDto } from './dto/apartamento.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Apartamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('apartamentos')
export class ApartamentosController {
  constructor(private readonly apartamentosService: ApartamentosService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Cadastra um apartamento no condomínio (Síndico)',
    description: 'Cria uma nova unidade habitacional vinculada ao condomínio do síndico logado.' 
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Apartamento cadastrado com sucesso' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  create(@CurrentUser() user: any, @Body() dto: CreateApartamentoDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.apartamentosService.create(user.condominioId, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lista todos os apartamentos do condomínio (Síndico)',
    description: 'Retorna a lista de todos os apartamentos cadastrados no condomínio.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista retornada com sucesso' })
  findAll(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.apartamentosService.findAll(user.condominioId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Busca detalhes de um apartamento (Síndico)',
    description: 'Retorna os detalhes de um apartamento específico, incluindo a lista de moradores vinculados.' 
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Apartamento encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Apartamento não encontrado' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.apartamentosService.findOne(id, user.condominioId);
  }
}
