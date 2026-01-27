import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    create(createPlayerDto: CreatePlayerDto): import("./entities/player.entity").Player;
    findAll(): import("./entities/player.entity").Player[];
    findOne(id: string): import("./entities/player.entity").Player;
    update(id: string, updatePlayerDto: UpdatePlayerDto): import("./entities/player.entity").Player;
    remove(id: string): void;
}
