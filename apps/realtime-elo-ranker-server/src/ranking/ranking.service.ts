import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class RankingService implements OnModuleInit {
  private ranking: Player[] = [];

  constructor(private readonly playerService: PlayerService) {}

  async onModuleInit() {
    await this.refreshRanking();
  }

  async refreshRanking() {
    const players = await this.playerService.findAll();
    this.ranking = players.sort((a, b) => b.rank - a.rank);
  }

  getRanking(): Player[] {
    return this.ranking;
  }

  @OnEvent('ranking.update')
  async handleRankingUpdate() {
    await this.refreshRanking();
  }
}
