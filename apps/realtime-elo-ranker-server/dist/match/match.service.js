"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const player_service_1 = require("../player/player.service");
let MatchService = class MatchService {
    playerService;
    eventEmitter;
    constructor(playerService, eventEmitter) {
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    async publishMatchResult(createMatchDto) {
        const { winner: winnerId, loser: loserId, draw } = createMatchDto;
        const winner = await this.playerService.findOne(winnerId).catch(() => null);
        const loser = await this.playerService.findOne(loserId).catch(() => null);
        if (!winner || !loser) {
            throw new common_1.UnprocessableEntityException('Winner or loser not found');
        }
        const K = 32;
        const expectedWinner = 1 / (1 + Math.pow(10, (loser.rank - winner.rank) / 400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winner.rank - loser.rank) / 400));
        let actualWinner = 1;
        let actualLoser = 0;
        if (draw) {
            actualWinner = 0.5;
            actualLoser = 0.5;
        }
        const newWinnerRank = Math.round(winner.rank + K * (actualWinner - expectedWinner));
        const newLoserRank = Math.round(loser.rank + K * (actualLoser - expectedLoser));
        await this.playerService.update(winner.id, { rank: newWinnerRank });
        await this.playerService.update(loser.id, { rank: newLoserRank });
        this.eventEmitter.emit('ranking.update', {
            type: 'RankingUpdate',
            player: { id: winner.id, rank: newWinnerRank },
        });
        this.eventEmitter.emit('ranking.update', {
            type: 'RankingUpdate',
            player: { id: loser.id, rank: newLoserRank },
        });
        return {
            winner: { id: winner.id, rank: newWinnerRank },
            loser: { id: loser.id, rank: newLoserRank },
        };
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map