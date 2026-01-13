import { Controller, Get, Sse } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@ApiTags('ranking')
@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Classement récupéré avec succès' })
  getRanking() {
    return this.rankingService.getRanking();
  }

  @Sse('events')
  @ApiResponse({ status: 200, description: 'Le client est abonné aux mises à jour du classement' })
  sse(): Observable<any> {
    return fromEvent(this.eventEmitter, 'ranking.update').pipe(
      map((data) => {
        return { data } as any;
      }),
    );
  }
}
