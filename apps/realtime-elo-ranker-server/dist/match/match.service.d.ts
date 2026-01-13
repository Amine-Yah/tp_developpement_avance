import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class MatchService {
    private readonly playerService;
    private readonly eventEmitter;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    publishMatchResult(createMatchDto: CreateMatchDto): Promise<{
        winner: {
            id: string;
            rank: number;
        };
        loser: {
            id: string;
            rank: number;
        };
    }>;
}
