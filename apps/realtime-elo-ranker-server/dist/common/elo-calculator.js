"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWinProbability = calculateWinProbability;
exports.calculateNewRank = calculateNewRank;
exports.calculateMatchResults = calculateMatchResults;
function calculateWinProbability(playerRank, opponentRank) {
    return 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
}
function calculateNewRank(currentRank, actualScore, expectedScore, kFactor = 32) {
    const newRank = currentRank + kFactor * (actualScore - expectedScore);
    return Math.round(newRank);
}
function calculateMatchResults(player1Rank, player2Rank, result, kFactor = 32) {
    const player1Expected = calculateWinProbability(player1Rank, player2Rank);
    const player2Expected = calculateWinProbability(player2Rank, player1Rank);
    let player1Score;
    let player2Score;
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
    const player1NewRank = calculateNewRank(player1Rank, player1Score, player1Expected, kFactor);
    const player2NewRank = calculateNewRank(player2Rank, player2Score, player2Expected, kFactor);
    return {
        player1NewRank,
        player2NewRank,
    };
}
//# sourceMappingURL=elo-calculator.js.map