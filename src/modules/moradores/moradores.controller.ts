import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { MoradoresService } from './moradores.service';
import { CreateMoradorDto } from './dto/morador.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateMoradorResponseDto, MoradorResponseDto, PerfilMoradorResponseDto } from './dto/morador-response.dto';

@ApiTags('Moradores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('moradores')
export class MoradoresController {
  constructor(private readonly moradoresService: MoradoresService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Cadastra um morador no condomínio (Síndico)',
    description: 'Cria um novo perfil de morador vinculado a um apartamento. Acesso exclusivo para síndicos.'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Morador criado com sucesso', 
    type: CreateMoradorResponseDto 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos ou e-mail já em uso' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  create(@CurrentUser() user: any, @Body() dto: CreateMoradorDto) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.moradoresService.create(user.condominioId, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lista todos os moradores do condomínio (Síndico)',
    description: 'Retorna a lista de todos os moradores cadastrados no condomínio do síndico logado.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de moradores retornada com sucesso', 
    type: [MoradorResponseDto] 
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  findAll(@CurrentUser() user: any) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.moradoresService.findAll(user.condominioId);
  }

  @Get('meu-perfil')
  @ApiOperation({ 
    summary: 'Retorna o perfil completo do morador logado (App Mobile)',
    description: 'Retorna os dados do morador logado, incluindo pontuação, nível e histórico recente de descartes.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Perfil retornado com sucesso', 
    type: PerfilMoradorResponseDto 
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Rota exclusiva para moradores' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Morador não encontrado' })
  meuPerfil(@CurrentUser() user: any) {
    if (user.type !== 'morador') throw new ForbiddenException('Rota exclusiva para moradores');
    return this.moradoresService.getMeuPerfil(user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Busca detalhes de um morador específico (Síndico)',
    description: 'Retorna os detalhes de um morador pelo ID. O morador deve pertencer ao condomínio do síndico.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Morador retornado com sucesso', 
    type: MoradorResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Morador não encontrado neste condomínio' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso restrito ao síndico' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.type !== 'admin') throw new ForbiddenException('Acesso restrito ao síndico');
    return this.moradoresService.findOne(id, user.condominioId);
  }
}
