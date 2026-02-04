import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable } from 'rxjs';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';

export interface RankingUpdate {
  type: 'RankingUpdate';
  player: {
    id: string;
    rank: number;
  };
}

@Injectable()
export class RankingService implements OnModuleInit {
  private ranking: Player[] = [];
  private rankingUpdates$ = new Subject<RankingUpdate>();

  constructor(private readonly playerService: PlayerService) {}

  onModuleInit() {
    this.refreshRanking();
  }

  refreshRanking(): void {
    const players = this.playerService.findAll();
    this.ranking = players.sort((a, b) => b.rank - a.rank);
  }

  getRanking(): Player[] {
    return this.ranking;
  }

  getUpdatesStream(): Observable<RankingUpdate> {
    return this.rankingUpdates$.asObservable();
  }

  @OnEvent('ranking.update')
  handleRankingUpdate(update: RankingUpdate) {
    this.refreshRanking();
    this.rankingUpdates$.next(update);
  }
}
