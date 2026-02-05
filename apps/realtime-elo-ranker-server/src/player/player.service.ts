import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoSQLService } from '../common/nosql.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  private collectionName = 'players';

  constructor(
    private readonly noSql: NoSQLService,
    private eventEmitter: EventEmitter2,
  ) {}

  private calculateAverageRank(): number {
    const players = this.noSql.find(this.collectionName);
    if (players.length === 0) {
      return 1200;
    }
    const sum = players.reduce((acc, player) => acc + player.rank, 0);
    return Math.round(sum / players.length);
  }

  create(createPlayerDto: CreatePlayerDto): Player {
    if (!createPlayerDto.id || createPlayerDto.id.trim().length === 0) {
      throw new BadRequestException('Player ID is invalid');
    }

    if (this.noSql.findOne(this.collectionName, { id: createPlayerDto.id })) {
      throw new ConflictException('Player already exists');
    }

    const averageRank = this.calculateAverageRank();
    const player = this.noSql.insert(this.collectionName, {
      id: createPlayerDto.id,
      rank: averageRank,
    });

    this.eventEmitter.emit('ranking.update', {
      type: 'RankingUpdate',
      player: {
        id: player.id,
        rank: player.rank,
      },
    });

    return player;
  }

  findAll(): Player[] {
    const players = this.noSql.findSorted(this.collectionName, 'rank', 'desc');
    return players.map(p => ({
      id: p.id,
      rank: p.rank,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  findOne(id: string): Player {
    const player = this.noSql.findById(this.collectionName, id) || 
                   this.noSql.findOne(this.collectionName, { id });
    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    return player;
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto): Player {
    const player = this.findOne(id);
    const updates: any = {};
    if (updatePlayerDto.rank !== undefined) {
      updates.rank = updatePlayerDto.rank;
    }
    
    const updated = this.noSql.updateById(
      this.collectionName,
      id,
      updates,
    );
    return updated;
  }

  remove(id: string): void {
    const player = this.findOne(id);
    const success = this.noSql.deleteById(this.collectionName, id);
    if (!success) {
      throw new NotFoundException(`Player #${id} not found`);
    }
  }
}
