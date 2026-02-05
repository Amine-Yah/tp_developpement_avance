import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoSQLService } from '../common/nosql.service';
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
    private readonly noSql;
    private readonly playerService;
    private readonly eventEmitter;
    private collectionName;
    private nextId;
    constructor(noSql: NoSQLService, playerService: PlayerService, eventEmitter: EventEmitter2);
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
