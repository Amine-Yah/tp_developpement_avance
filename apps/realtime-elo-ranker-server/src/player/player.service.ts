import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  private players: Map<string, Player> = new Map();

  constructor(private eventEmitter: EventEmitter2) {}

  private calculateAverageRank(): number {
    if (this.players.size === 0) {
      return 1200; // Default rank if no players exist
    }
    const sum = Array.from(this.players.values()).reduce((acc, player) => acc + player.rank, 0);
    return Math.round(sum / this.players.size);
  }

  create(createPlayerDto: CreatePlayerDto): Player {
    if (!createPlayerDto.id || createPlayerDto.id.trim().length === 0) {
      throw new BadRequestException('Player ID is invalid');
    }
    
    if (this.players.has(createPlayerDto.id)) {
      throw new ConflictException('Player already exists');
    }
    
    const averageRank = this.calculateAverageRank();
    const player: Player = {
      id: createPlayerDto.id,
      rank: averageRank,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.players.set(player.id, player);
    
    // Emit event to notify other services (like RankingService)
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
    const playersArray = Array.from(this.players.values());
    return playersArray.sort((a, b) => b.rank - a.rank);
  }

  findOne(id: string): Player {
    const player = this.players.get(id);
    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    return player;
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto): Player {
    const player = this.findOne(id);
    if (updatePlayerDto.rank !== undefined) {
      player.rank = updatePlayerDto.rank;
      player.updatedAt = new Date();
    }
    return player;
  }

  remove(id: string): void {
    if (!this.players.has(id)) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    this.players.delete(id);
  }
}
