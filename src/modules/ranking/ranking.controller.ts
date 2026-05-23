import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RankingService } from './ranking.service';
import { RankingItemResponseDto } from './dto/ranking-response.dto';

type RankingUser = {
  id?: string;
  apartamentoId?: string;
  condominioId: string;
};

@ApiTags('Ranking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('mensal')
  @ApiOperation({
    summary: 'Ranking mensal do condomínio',
    description:
      'Retorna a classificação mensal dos apartamentos do condomínio do usuário logado. Pode ser consumido pelo app mobile.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ranking retornado com sucesso',
    type: [RankingItemResponseDto],
  })
  getRankingMensal(@CurrentUser() user: RankingUser) {
    return this.rankingService.getRankingMensal(user.condominioId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Meu ranking mensal',
    description: 'Retorna a posição e estatísticas do morador logado no ranking mensal do seu condomínio.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Informações do usuário no ranking retornadas com sucesso',
    type: RankingItemResponseDto,
  })
  getMeuRankingMensal(@CurrentUser() user: RankingUser) {
    return this.rankingService.getMeuRankingMensal(user.apartamentoId as string, user.condominioId);
  }
}
