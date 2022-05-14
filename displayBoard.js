const tag = (tagName, content, atrribute = '') =>
  ['<' + tagName, atrribute, '>', content, '</' + tagName, '>'].join(' ');

const createBoard = function (card, header) {
  const board = card.reduce((board, element) => {
    let atrribute = 'class=element';
    if (element === '*') {
      atrribute = 'class="guessed"';
      // eslint-disable-next-line no-param-reassign
      element = '⭐️';
    }
    return board + tag('div', element, atrribute);
  }, '');
  const boardHeader = tag('div', header, 'class="card-heading"');
  return tag('section', boardHeader + board, 'class="card"');
};

const gameCards = function ({ user, comp }) {
  const userCard = createBoard(user, 'User');
  const compCard = createBoard(comp, 'Computer');
  return tag('div', userCard + compCard, 'class="cards"');
};

const winner = ({ winner }) => tag('div', winner, 'class="winner"');
const heading = () => tag('header', tag('h1', 'BINGO'));

const displayGame = function (gameState) {
  const header = heading();
  const board = gameCards(gameState);
  const result = winner(gameState);
  const link = '<link rel="stylesheet" href="style.css">';
  const head = tag('head', link);
  const body = tag('body', tag('div', header + board + result, 'class="game"'));
  return tag('html', head + body);
};

exports.displayGame = displayGame;

