export declare function calculateWinProbability(playerRank: number, opponentRank: number): number;
export declare function calculateNewRank(currentRank: number, actualScore: number, expectedScore: number, kFactor?: number): number;
export declare function calculateMatchResults(player1Rank: number, player2Rank: number, result: 'player1' | 'player2' | 'draw', kFactor?: number): {
    player1NewRank: number;
    player2NewRank: number;
};
