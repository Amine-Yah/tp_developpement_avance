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
const nosql_service_1 = require("../common/nosql.service");
const player_service_1 = require("../player/player.service");
const elo_calculator_1 = require("../common/elo-calculator");
let MatchService = class MatchService {
    noSql;
    playerService;
    eventEmitter;
    collectionName = 'matches';
    nextId = 1;
    constructor(noSql, playerService, eventEmitter) {
        this.noSql = noSql;
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
        const matches = this.noSql.find(this.collectionName);
        if (matches.length > 0) {
            this.nextId = Math.max(...matches.map(m => m.id || 0)) + 1;
        }
    }
    publishMatchResult(createMatchDto) {
        const { winner: winnerId, loser: loserId, draw } = createMatchDto;
        let winner, loser;
        try {
            winner = this.playerService.findOne(winnerId);
            loser = this.playerService.findOne(loserId);
        }
        catch {
            throw new common_1.UnprocessableEntityException('Winner or loser not found');
        }
        const result = draw ? 'draw' : 'player1';
        const { player1NewRank, player2NewRank } = (0, elo_calculator_1.calculateMatchResults)(winner.rank, loser.rank, result);
        this.playerService.update(winner.id, { rank: player1NewRank });
        this.playerService.update(loser.id, { rank: player2NewRank });
        const match = {
            id: this.nextId++,
            player1Id: winner.id,
            player2Id: loser.id,
            result,
            player1OldRank: winner.rank,
            player2OldRank: loser.rank,
            player1NewRank,
            player2NewRank,
            timestamp: new Date(),
        };
        this.noSql.insert(this.collectionName, match);
        this.eventEmitter.emit('ranking.update', {
            type: 'RankingUpdate',
            player: { id: winner.id, rank: player1NewRank },
        });
        this.eventEmitter.emit('ranking.update', {
            type: 'RankingUpdate',
            player: { id: loser.id, rank: player2NewRank },
        });
        return {
            winner: { id: winner.id, rank: player1NewRank },
            loser: { id: loser.id, rank: player2NewRank },
        };
    }
    findAll() {
        return this.noSql.find(this.collectionName);
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nosql_service_1.NoSQLService,
        player_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map