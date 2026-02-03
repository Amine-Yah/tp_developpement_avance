import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
export declare class PlayerService {
    private eventEmitter;
    private players;
    constructor(eventEmitter: EventEmitter2);
    private calculateAverageRank;
    create(createPlayerDto: CreatePlayerDto): Player;
    findAll(): Player[];
    findOne(id: string): Player;
    update(id: string, updatePlayerDto: UpdatePlayerDto): Player;
    remove(id: string): void;
}
