import { Controller, Get, Sse } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RankingService } from './ranking.service';
import { Observable, map } from 'rxjs';

@ApiTags('ranking')
@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Classement récupéré avec succès' })
  getRanking() {
    return this.rankingService.getRanking();
  }

  @Sse('events')
  @ApiResponse({ status: 200, description: 'Le client est abonné aux mises à jour du classement' })
  sse(): Observable<any> {
    return this.rankingService.getUpdatesStream().pipe(
      map((update) => ({ data: update })),
    );
  }
}
