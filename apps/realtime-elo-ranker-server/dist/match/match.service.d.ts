import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
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
export declare class MatchService {
    private readonly playerService;
    private readonly eventEmitter;
    private matches;
    private nextId;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    publishMatchResult(createMatchDto: CreateMatchDto): {
        winner: {
            id: any;
            rank: number;
        };
        loser: {
            id: any;
            rank: number;
        };
    };
    findAll(): Match[];
}
