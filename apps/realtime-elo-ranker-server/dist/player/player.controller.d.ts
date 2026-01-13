import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    create(createPlayerDto: CreatePlayerDto): Promise<import("./entities/player.entity").Player>;
    findAll(): Promise<import("./entities/player.entity").Player[]>;
    findOne(id: string): Promise<import("./entities/player.entity").Player>;
    update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<import("./entities/player.entity").Player>;
    remove(id: string): Promise<void>;
}
