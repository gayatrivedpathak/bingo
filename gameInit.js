const { readFileSync } = require('fs');

const game = JSON.parse(readFileSync('./game.json', 'utf8'));

const createPlayers = function (playerNames, game) {
  return playerNames.reduce((players, name, index) => {
    players[name] = {
      board: game['player' + (index + 1)],
      matchedCount: 0
    };
    return players;
  }, {});
};

const gameState = function (game) {
  return {
    players: createPlayers(['user', 'comp'], game),
    isGameOn: true,
    currentPlayer: '',
    choosen: []
  };
};

console.log(JSON.stringify(gameState(game)));
