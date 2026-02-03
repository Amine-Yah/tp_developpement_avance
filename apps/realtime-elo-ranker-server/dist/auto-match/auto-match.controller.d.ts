import { AutoMatchService } from './auto-match.service';
export declare class AutoMatchController {
    private readonly autoMatchService;
    constructor(autoMatchService: AutoMatchService);
    startAutoMatches(params?: {
        interval?: string;
    }): {
        message: string;
        interval: number;
    };
    stopAutoMatches(): {
        message: string;
    };
    getStatus(): {
        isRunning: boolean;
    };
}
