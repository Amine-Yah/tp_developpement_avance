import { OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';
export interface RankingUpdate {
    type: 'RankingUpdate';
    player: {
        id: string;
        rank: number;
    };
}
export declare class RankingService implements OnModuleInit {
    private readonly playerService;
    private ranking;
    private rankingUpdates$;
    constructor(playerService: PlayerService);
    onModuleInit(): void;
    refreshRanking(): void;
    getRanking(): Player[];
    getUpdatesStream(): Observable<RankingUpdate>;
    handleRankingUpdate(update: RankingUpdate): void;
}
