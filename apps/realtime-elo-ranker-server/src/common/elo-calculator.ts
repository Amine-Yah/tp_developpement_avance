/**
 * Calcule la probabilité de victoire d'un joueur selon la formule Elo
 * We = 1 / (1 + 10^((Rh - Rl) / 400))
 * 
 * @param playerRank - Classement du joueur
 * @param opponentRank - Classement de l'adversaire
 * @returns Probabilité de victoire entre 0 et 1
 */
export function calculateWinProbability(playerRank: number, opponentRank: number): number {
  return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
}

/**
 * Calcule le nouveau classement d'un joueur après un match
 * Rn = Ro + K * (W - We)
 * 
 * @param currentRank - Classement actuel du joueur
 * @param actualScore - Résultat réel du match (1 = victoire, 0.5 = égalité, 0 = défaite)
 * @param expectedScore - Probabilité de victoire calculée
 * @param kFactor - Facteur K (sensibilité du classement)
 * @returns Nouveau classement arrondi
 */
export function calculateNewRank(
  currentRank: number,
  actualScore: number,
  expectedScore: number,
  kFactor: number = 32
): number {
  const newRank = currentRank + kFactor * (actualScore - expectedScore);
  return Math.round(newRank);
}

/**
 * Calcule les nouveaux classements pour les deux joueurs après un match
 * 
 * @param player1Rank - Classement du joueur 1
 * @param player2Rank - Classement du joueur 2
 * @param result - Résultat du match ('player1' = joueur 1 gagne, 'player2' = joueur 2 gagne, 'draw' = égalité)
 * @param kFactor - Facteur K (sensibilité du classement)
 * @returns Objet contenant les nouveaux classements des deux joueurs
 */
export function calculateMatchResults(
  player1Rank: number,
  player2Rank: number,
  result: 'player1' | 'player2' | 'draw',
  kFactor: number = 32
): { player1NewRank: number; player2NewRank: number } {
  // Calcul des probabilités de victoire
  const player1Expected = calculateWinProbability(player1Rank, player2Rank);
  const player2Expected = calculateWinProbability(player2Rank, player1Rank);

  // Détermination des scores réels selon le résultat
  let player1Score: number;
  let player2Score: number;

  switch (result) {
    case 'player1':
      player1Score = 1;
      player2Score = 0;
      break;
    case 'player2':
      player1Score = 0;
      player2Score = 1;
      break;
    case 'draw':
      player1Score = 0.5;
      player2Score = 0.5;
      break;
  }

  // Calcul des nouveaux classements
  const player1NewRank = calculateNewRank(player1Rank, player1Score, player1Expected, kFactor);
  const player2NewRank = calculateNewRank(player2Rank, player2Score, player2Expected, kFactor);

  return {
    player1NewRank,
    player2NewRank,
  };
}
