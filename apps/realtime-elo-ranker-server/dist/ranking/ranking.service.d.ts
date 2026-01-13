import { OnModuleInit } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/entities/player.entity';
export declare class RankingService implements OnModuleInit {
    private readonly playerService;
    private ranking;
    constructor(playerService: PlayerService);
    onModuleInit(): Promise<void>;
    refreshRanking(): Promise<void>;
    getRanking(): Player[];
    handleRankingUpdate(): Promise<void>;
}
