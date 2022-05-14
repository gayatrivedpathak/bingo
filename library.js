/* eslint-disable no-magic-numbers */
const { writeFileSync } = require('fs');
const { displayGame } = require('./displayBoard.js');

const bingo = {
  maxRound: 25,
  // eslint-disable-next-line max-len
  comp: [11, 24, 6, 19, 15, 21, 8, 22, 4, 23, 9, 13, 1, 14, 2, 25, 10, 16, 17, 3, 18, 20, 7, 5, 12],
  // eslint-disable-next-line max-len
  user: [1, 11, 19, 6, 18, 23, 22, 12, 25, 3, 17, 24, 5, 13, 9, 15, 4, 20, 2, 21, 7, 16, 8, 14, 10],
  matchingPositions: {
    row1: [0, 1, 2, 3, 4],
    row2: [5, 6, 7, 8, 9],
    row3: [10, 11, 12, 13, 14],
    row4: [15, 16, 17, 18, 19],
    row5: [20, 21, 22, 23, 24],
    column1: [0, 5, 10, 15, 20],
    column2: [1, 6, 11, 16, 21],
    column3: [2, 7, 12, 17, 22],
    column4: [3, 8, 13, 18, 23],
    column5: [4, 9, 14, 19, 24],
    diagonal1: [0, 6, 12, 18, 24],
    diagonal2: [4, 8, 12, 16, 20]
  },
};

const determineResult = function ({ userMatchedCount, compMatchedCount }) {
  if (userMatchedCount > compMatchedCount) {
    return 'User';
  }
  if (userMatchedCount < compMatchedCount) {
    return 'Computer';
  }
  return 'Draw';
};

const isAllSame = function (player, positions) {
  for (let index = 0; index < positions.length - 1; index++) {
    if (player[positions[index]] !== player[positions[index + 1]]) {
      return false;
    }
  }
  return true;
};

const updateCount = function (gameState, matchingPositions) {
  const { user, comp } = gameState;
  gameState.compMatchedCount = 0;
  gameState.userMatchedCount = 0;
  const positionsList = Object.values(matchingPositions);
  for (let index = 0; index < positionsList.length; index++) {
    if (isAllSame(user, positionsList[index])) {
      gameState.userMatchedCount += 1;
    }
    if (isAllSame(comp, positionsList[index])) {
      gameState.compMatchedCount += 1;
    }
  }
  return gameState;
};

const updateState = function (gameState, choice) {
  for (let index = 0; index < gameState.user.length; index++) {
    if (gameState.user[index] === choice) {
      gameState.user[index] = '*';
    }
    if (gameState.comp[index] === choice) {
      gameState.comp[index] = '*';
    }
  }
  return gameState;
};

const randomChoice = function (number, choosenIndices) {
  const randomInt = Math.floor(Math.random() * number);
  if (!choosenIndices.includes(randomInt)) {
    choosenIndices.push(randomInt);
    return randomInt;
  }
  return randomChoice(number, choosenIndices);
};

const isGameOn = function ({ userMatchedCount, compMatchedCount }, maxRound) {
  const maxLineToWin = Math.sqrt(maxRound);
  return userMatchedCount < maxLineToWin && compMatchedCount < maxLineToWin;
};

const playGame = function ({ user, comp, matchingPositions, maxRound }) {
  let gameState = { user, comp };
  const choosenIndices = [];
  gameState.compMatchedCount = 0;
  gameState.userMatchedCount = 0;
  while (isGameOn(gameState, maxRound)) {
    const choice = randomChoice(maxRound, choosenIndices);
    gameState = updateState(gameState, choice);
    gameState = updateCount(gameState, matchingPositions);
  }
  gameState.winner = determineResult(gameState);
  return gameState;
};

writeFileSync('./index.html', displayGame(playGame(bingo)));

// eslint-disable-next-line no-console
console.log(playGame(bingo));
