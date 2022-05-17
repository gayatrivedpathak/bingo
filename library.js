const fs = require('fs');
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
  comp.matchedCount = 0;
  user.matchedCount = 0;
  const positionsList = Object.values(matchingPositions);
  for (let index = 0; index < positionsList.length; index++) {
    if (isAllSame(user, positionsList[index])) {
      user.matchedCount += 1;
    }
    if (isAllSame(comp, positionsList[index])) {
      comp.matchedCount += 1;
    }
  }
  return gameState;
};

const updateState = function (gameState, choice) {
  const { players } = gameState;
  for (let index = 0; index < players.user.board.length; index++) {
    if (players.user.board[index] === choice) {
      players.user.board[index] = '*';
    }
    if (players.comp.board[index] === choice) {
      players.comp.board[index] = '*';
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

const readFile = function (fileName) {
  try {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
  } catch (error) {
    console.log('Something went wrong!');
    process.exit(4);
  }
};

const writeJSONFile = function (fileName, content) {
  try {
    fs.writeFileSync(fileName, JSON.stringify(content));
  } catch (error) {
    console.log('Something went wrong!');
    process.exit(4);
  }
};

const main = function () {
  const bingo = readFile('./game.json');
  const gameState = readFile('./gameState.json');
  const updatedState = playGame(bingo, gameState, process.argv.slice(2));
  writeJSONFile('./gameState.json', updatedState);
};

main();
