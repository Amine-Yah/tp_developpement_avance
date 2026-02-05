import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoSQLService } from '../common/nosql.service';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { calculateMatchResults } from '../common/elo-calculator';

export interface Match {
  id: number;
  player1Id: string;
  player2Id: string;
  result: 'player1' | 'player2' | 'draw';
  player1OldRank: number;
  player2OldRank: number;
  player1NewRank: number;
  player2NewRank: number;
  timestamp: Date;
}

@Injectable()
export class MatchService {
  private collectionName = 'matches';
  private nextId = 1;

  constructor(
    private readonly noSql: NoSQLService,
    private readonly playerService: PlayerService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // Charger le dernier ID depuis la BD
    const matches = this.noSql.find(this.collectionName);
    if (matches.length > 0) {
      this.nextId = Math.max(...matches.map(m => m.id || 0)) + 1;
    }
  }

  publishMatchResult(createMatchDto: CreateMatchDto) {
    const { winner: winnerId, loser: loserId, draw } = createMatchDto;

    // Récupération des joueurs
    let winner, loser;
    try {
      winner = this.playerService.findOne(winnerId);
      loser = this.playerService.findOne(loserId);
    } catch {
      throw new UnprocessableEntityException('Winner or loser not found');
    }

    // Détermination du résultat
    const result: 'player1' | 'player2' | 'draw' = draw ? 'draw' : 'player1';

    // Calcul des nouveaux classements
    const { player1NewRank, player2NewRank } = calculateMatchResults(
      winner.rank,
      loser.rank,
      result
    );

    // Mise à jour des classements
    this.playerService.update(winner.id, { rank: player1NewRank });
    this.playerService.update(loser.id, { rank: player2NewRank });

    // Sauvegarde du match dans la BD
    const match: Match = {
      id: this.nextId++,
      player1Id: winner.id,
      player2Id: loser.id,
      result,
      player1OldRank: winner.rank,
      player2OldRank: loser.rank,
      player1NewRank,
      player2NewRank,
      timestamp: new Date(),
    };
    this.noSql.insert(this.collectionName, match);

    // Émission des événements
    this.eventEmitter.emit('ranking.update', {
      type: 'RankingUpdate',
      player: { id: winner.id, rank: player1NewRank },
    });

    this.eventEmitter.emit('ranking.update', {
      type: 'RankingUpdate',
      player: { id: loser.id, rank: player2NewRank },
    });

    return {
      winner: { id: winner.id, rank: player1NewRank },
      loser: { id: loser.id, rank: player2NewRank },
    };
  }

  findAll(): Match[] {
    return this.noSql.find(this.collectionName);
  }
}
