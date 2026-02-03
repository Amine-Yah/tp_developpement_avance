import { PlayerService } from '../player/player.service';
import { MatchService } from '../match/match.service';
export declare class AutoMatchService {
    private readonly playerService;
    private readonly matchService;
    private autoMatchInterval;
    private isRunning;
    constructor(playerService: PlayerService, matchService: MatchService);
    private generateRandomMatch;
    startAutoMatches(interval?: number): void;
    stopAutoMatches(): void;
    getStatus(): {
        isRunning: boolean;
    };
}
