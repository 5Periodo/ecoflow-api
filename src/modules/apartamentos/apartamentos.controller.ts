import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApartamentosService } from './apartamentos.service';
import { CreateApartamentoDto } from './dto/apartamento.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Apartamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('apartamentos')
export class ApartamentosController {
  constructor(private readonly apartamentosService: ApartamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um apartamento no condomínio (Síndico)' })
  create(@CurrentUser() user: any, @Body() dto: CreateApartamentoDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.apartamentosService.create(user.condominioId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os apartamentos do condomínio (Síndico)' })
  findAll(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.apartamentosService.findAll(user.condominioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de um apartamento com moradores (Síndico)' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.apartamentosService.findOne(id, user.condominioId);
  }
}
