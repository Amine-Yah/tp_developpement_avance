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
exports.AutoMatchService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const match_service_1 = require("../match/match.service");
let AutoMatchService = class AutoMatchService {
    playerService;
    matchService;
    autoMatchInterval = null;
    isRunning = false;
    constructor(playerService, matchService) {
        this.playerService = playerService;
        this.matchService = matchService;
    }
    generateRandomMatch() {
        const players = this.playerService.findAll();
        if (players.length < 2) {
            console.log('Pas assez de joueurs pour générer un match');
            return;
        }
        const player1Index = Math.floor(Math.random() * players.length);
        let player2Index = Math.floor(Math.random() * players.length);
        while (player2Index === player1Index && players.length > 1) {
            player2Index = Math.floor(Math.random() * players.length);
        }
        const player1 = players[player1Index];
        const player2 = players[player2Index];
        const player1Wins = Math.random() < 0.5;
        const winnerId = player1Wins ? player1.id : player2.id;
        const loserId = player1Wins ? player2.id : player1.id;
        this.matchService.publishMatchResult({
            winner: winnerId,
            loser: loserId,
        });
        console.log(`Match généré: ${player1.id} vs ${player2.id} - Gagnant: ${winnerId}`);
    }
    startAutoMatches(interval = 5000) {
        if (this.isRunning) {
            console.log('Les matches automatiques sont déjà en cours');
            return;
        }
        this.isRunning = true;
        console.log(`Démarrage des matches automatiques (intervalle: ${interval}ms)`);
        this.autoMatchInterval = setInterval(() => {
            this.generateRandomMatch();
        }, interval);
    }
    stopAutoMatches() {
        if (!this.isRunning) {
            console.log('Les matches automatiques ne sont pas en cours');
            return;
        }
        if (this.autoMatchInterval) {
            clearInterval(this.autoMatchInterval);
            this.autoMatchInterval = null;
        }
        this.isRunning = false;
        console.log('Matches automatiques arrêtés');
    }
    getStatus() {
        return { isRunning: this.isRunning };
    }
};
exports.AutoMatchService = AutoMatchService;
exports.AutoMatchService = AutoMatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        match_service_1.MatchService])
], AutoMatchService);
//# sourceMappingURL=auto-match.service.js.map