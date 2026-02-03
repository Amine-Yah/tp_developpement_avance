import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { MatchService } from '../match/match.service';

@Injectable()
export class AutoMatchService {
  private autoMatchInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(
    private readonly playerService: PlayerService,
    private readonly matchService: MatchService,
  ) {}

  /**
   * Génère un match automatique entre deux joueurs aléatoires
   */
  private generateRandomMatch(): void {
    const players = this.playerService.findAll();
    
    if (players.length < 2) {
      console.log('Pas assez de joueurs pour générer un match');
      return;
    }

    // Sélectionner deux joueurs aléatoires différents
    const player1Index = Math.floor(Math.random() * players.length);
    let player2Index = Math.floor(Math.random() * players.length);
    
    while (player2Index === player1Index && players.length > 1) {
      player2Index = Math.floor(Math.random() * players.length);
    }

    const player1 = players[player1Index];
    const player2 = players[player2Index];

    // Déterminer aléatoirement le gagnant (50/50)
    const player1Wins = Math.random() < 0.5;
    const winnerId = player1Wins ? player1.id : player2.id;
    const loserId = player1Wins ? player2.id : player1.id;

    // Enregistrer le match
    this.matchService.publishMatchResult({
      winner: winnerId,
      loser: loserId,
    });

    console.log(
      `Match généré: ${player1.id} vs ${player2.id} - Gagnant: ${winnerId}`,
    );
  }

  /**
   * Démarre les matches automatiques
   * @param interval Intervalle en millisecondes (par défaut 5000ms = 5s)
   */
  startAutoMatches(interval: number = 5000): void {
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

  /**
   * Arrête les matches automatiques
   */
  stopAutoMatches(): void {
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

  /**
   * Retourne l'état des matches automatiques
   */
  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}
