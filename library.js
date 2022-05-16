/* eslint-disable no-magic-numbers */
const { writeFileSync, readFileSync } = require('fs');
// const { displayGame } = require('./displayBoard.js');

const isAllSame = function ({ board }, positions) {
  for (let index = 0; index < positions.length - 1; index++) {
    if (board[positions[index]] !== board[positions[index + 1]]) {
      return false;
    }
  }
  return true;
};

const updateCount = function (gameState, matchingPositions) {
  const { user, comp } = gameState.players;
  gameState.players.comp.matchedCount = 0;
  gameState.players.user.matchedCount = 0;
  const positionsList = Object.values(matchingPositions);
  for (let index = 0; index < positionsList.length; index++) {
    if (isAllSame(user, positionsList[index])) {
      gameState.players.user.matchedCount += 1;
    }
    if (isAllSame(comp, positionsList[index])) {
      gameState.players.comp.matchedCount += 1;
    }
  }
  return gameState;
};

const updateState = function (gameState, choice) {
  for (let index = 0; index < gameState.players.user.board.length; index++) {
    if (gameState.players.user.board[index] === choice) {
      gameState.players.user.board[index] = '*';
    }
    if (gameState.players.comp.board[index] === choice) {
      gameState.players.comp.board[index] = '*';
    }
  }
  return gameState;
};

const isGameOn = function ({ players }, maxRound) {
  const maxLineToWin = Math.sqrt(maxRound);
  const userMatchedCount = players.user.matchedCount;
  const compMatchedCount = players.comp.matchedCount;
  return userMatchedCount < maxLineToWin && compMatchedCount < maxLineToWin;
};

const playGame = function (game, gameState, [choice, player]) {
  const { maxRound, matchingPositions } = game;
  let currentState = gameState;
  currentState = updateState(currentState, +choice);
  currentState.choosen.push(+choice);
  currentState.currentPlayer = player;
  currentState = updateCount(currentState, matchingPositions);
  currentState.isGameOn = isGameOn(currentState, maxRound);
  return currentState;
};

const bingo = JSON.parse(readFileSync('./game.json', 'utf8'));
const gameState = JSON.parse(readFileSync('./gameState.json', 'utf8'));

const updatedState = playGame(bingo, gameState, process.argv.slice(2));
writeFileSync('./gameState.json', JSON.stringify(updatedState));
