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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const nosql_service_1 = require("../common/nosql.service");
let PlayerService = class PlayerService {
    noSql;
    eventEmitter;
    collectionName = 'players';
    constructor(noSql, eventEmitter) {
        this.noSql = noSql;
        this.eventEmitter = eventEmitter;
    }
    calculateAverageRank() {
        const players = this.noSql.find(this.collectionName);
        if (players.length === 0) {
            return 1200;
        }
        const sum = players.reduce((acc, player) => acc + player.rank, 0);
        return Math.round(sum / players.length);
    }
    create(createPlayerDto) {
        if (!createPlayerDto.id || createPlayerDto.id.trim().length === 0) {
            throw new common_1.BadRequestException('Player ID is invalid');
        }
        if (this.noSql.findOne(this.collectionName, { id: createPlayerDto.id })) {
            throw new common_1.ConflictException('Player already exists');
        }
        const averageRank = this.calculateAverageRank();
        const player = this.noSql.insert(this.collectionName, {
            id: createPlayerDto.id,
            rank: averageRank,
        });
        this.eventEmitter.emit('ranking.update', {
            type: 'RankingUpdate',
            player: {
                id: player.id,
                rank: player.rank,
            },
        });
        return player;
    }
    findAll() {
        const players = this.noSql.findSorted(this.collectionName, 'rank', 'desc');
        return players.map(p => ({
            id: p.id,
            rank: p.rank,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
    findOne(id) {
        const player = this.noSql.findById(this.collectionName, id) ||
            this.noSql.findOne(this.collectionName, { id });
        if (!player) {
            throw new common_1.NotFoundException(`Player #${id} not found`);
        }
        return player;
    }
    update(id, updatePlayerDto) {
        const player = this.findOne(id);
        const updates = {};
        if (updatePlayerDto.rank !== undefined) {
            updates.rank = updatePlayerDto.rank;
        }
        const updated = this.noSql.updateById(this.collectionName, id, updates);
        return updated;
    }
    remove(id) {
        const player = this.findOne(id);
        const success = this.noSql.deleteById(this.collectionName, id);
        if (!success) {
            throw new common_1.NotFoundException(`Player #${id} not found`);
        }
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nosql_service_1.NoSQLService,
        event_emitter_1.EventEmitter2])
], PlayerService);
//# sourceMappingURL=player.service.js.map