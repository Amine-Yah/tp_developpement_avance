import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
export declare class RankingController {
    private readonly rankingService;
    private readonly eventEmitter;
    constructor(rankingService: RankingService, eventEmitter: EventEmitter2);
    getRanking(): import("../player/entities/player.entity").Player[];
    sse(): Observable<any>;
}
