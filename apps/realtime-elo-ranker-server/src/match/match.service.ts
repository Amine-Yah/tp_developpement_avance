import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async publishMatchResult(createMatchDto: CreateMatchDto) {
    const { winner: winnerId, loser: loserId, draw } = createMatchDto;

    const winner = await this.playerService.findOne(winnerId).catch(() => null);
    const loser = await this.playerService.findOne(loserId).catch(() => null);

    if (!winner || !loser) {
      throw new UnprocessableEntityException('Winner or loser not found');
    }

    const K = 32;
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.rank - winner.rank) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.rank - loser.rank) / 400));

    let actualWinner = 1;
    let actualLoser = 0;

    if (draw) {
      actualWinner = 0.5;
      actualLoser = 0.5;
    }

    const newWinnerRank = Math.round(winner.rank + K * (actualWinner - expectedWinner));
    const newLoserRank = Math.round(loser.rank + K * (actualLoser - expectedLoser));

    await this.playerService.update(winner.id, { rank: newWinnerRank });
    await this.playerService.update(loser.id, { rank: newLoserRank });

    // Emit events
    this.eventEmitter.emit('ranking.update', {
      type: 'RankingUpdate',
      player: { id: winner.id, rank: newWinnerRank },
    });

    this.eventEmitter.emit('ranking.update', {
      type: 'RankingUpdate',
      player: { id: loser.id, rank: newLoserRank },
    });

    return {
      winner: { id: winner.id, rank: newWinnerRank },
      loser: { id: loser.id, rank: newLoserRank },
    };
  }
}
