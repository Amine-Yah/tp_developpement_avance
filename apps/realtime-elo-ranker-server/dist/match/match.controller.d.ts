import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
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
}
