"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
let PlayerService = class PlayerService {
    players = new Map();
    calculateAverageRank() {
        if (this.players.size === 0) {
            return 1200;
        }
        const sum = Array.from(this.players.values()).reduce((acc, player) => acc + player.rank, 0);
        return Math.round(sum / this.players.size);
    }
    create(createPlayerDto) {
        if (!createPlayerDto.id || createPlayerDto.id.trim().length === 0) {
            throw new common_1.BadRequestException('Player ID is invalid');
        }
        if (this.players.has(createPlayerDto.id)) {
            throw new common_1.ConflictException('Player already exists');
        }
        const averageRank = this.calculateAverageRank();
        const player = {
            id: createPlayerDto.id,
            rank: averageRank,
        };
        this.players.set(player.id, player);
        return player;
    }
    findAll() {
        return Array.from(this.players.values());
    }
    findOne(id) {
        const player = this.players.get(id);
        if (!player) {
            throw new common_1.NotFoundException(`Player #${id} not found`);
        }
        return player;
    }
    update(id, updatePlayerDto) {
        const player = this.findOne(id);
        if (updatePlayerDto.rank !== undefined) {
            player.rank = updatePlayerDto.rank;
        }
        this.players.set(id, player);
        return player;
    }
    remove(id) {
        if (!this.players.delete(id)) {
            throw new common_1.NotFoundException(`Player #${id} not found`);
        }
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)()
], PlayerService);
//# sourceMappingURL=player.service.js.map