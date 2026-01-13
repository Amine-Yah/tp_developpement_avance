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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const player_service_1 = require("../player/player.service");
let RankingService = class RankingService {
    playerService;
    ranking = [];
    constructor(playerService) {
        this.playerService = playerService;
    }
    async onModuleInit() {
        await this.refreshRanking();
    }
    async refreshRanking() {
        const players = await this.playerService.findAll();
        this.ranking = players.sort((a, b) => b.rank - a.rank);
    }
    getRanking() {
        return this.ranking;
    }
    async handleRankingUpdate() {
        await this.refreshRanking();
    }
};
exports.RankingService = RankingService;
__decorate([
    (0, event_emitter_1.OnEvent)('ranking.update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankingService.prototype, "handleRankingUpdate", null);
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map