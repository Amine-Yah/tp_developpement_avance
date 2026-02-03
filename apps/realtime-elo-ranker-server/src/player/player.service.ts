import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
  ) {}

  private async calculateAverageRank(): Promise<number> {
    const players = await this.playerRepository.find();
    if (players.length === 0) {
      return 1200; // Default rank if no players exist
    }
    const sum = players.reduce((acc, player) => acc + player.rank, 0);
    return Math.round(sum / players.length);
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    if (!createPlayerDto.id || createPlayerDto.id.trim().length === 0) {
      throw new BadRequestException('Player ID is invalid');
    }
    
    const existingPlayer = await this.playerRepository.findOne({
      where: { id: createPlayerDto.id },
    });
    if (existingPlayer) {
      throw new ConflictException('Player already exists');
    }
    
    const averageRank = await this.calculateAverageRank();
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
      rank: averageRank,
    });
    
    await this.playerRepository.save(player);
    
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

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find({
      order: {
        rank: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
    });
    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);
    if (updatePlayerDto.rank !== undefined) {
      player.rank = updatePlayerDto.rank;
    }
    return this.playerRepository.save(player);
  }

  async remove(id: string): Promise<void> {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
}
