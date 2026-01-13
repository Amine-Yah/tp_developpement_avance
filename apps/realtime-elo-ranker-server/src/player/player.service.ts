import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const existing = await this.playerRepository.findOneBy({ id: createPlayerDto.id });
    if (existing) {
      throw new ConflictException('Player already exists');
    }
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
      rank: 1200, // Default rank
    });
    return this.playerRepository.save(player);
  }

  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);
    Object.assign(player, updatePlayerDto);
    return this.playerRepository.save(player);
  }

  async remove(id: string): Promise<void> {
    await this.playerRepository.delete(id);
  }
}
