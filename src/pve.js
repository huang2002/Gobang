import { resetBoard, $board, setMove } from './view.js';
import { hideMenu } from './menu.js';
import { $moveHook, $gameOver, gameOver } from './toolbar.js';
import { $round } from './header.js';
import { getSide, opposite, BLACK } from './common.js';
import { countPaths, checkDraw } from './path.js';
import { findMove, FIRST_MOVE } from './ai.js';

/**
 * @param {boolean} playerFirst
 */
export const initPvE = playerFirst => {
    $moveHook.setSync(moveHookPvE);
    $round.setSync(playerFirst ? 1 : 2);
    $gameOver.setSync(false);
    resetBoard();
    if (!playerFirst) {
        setMove(FIRST_MOVE, BLACK);
    }
    hideMenu();
};

/**
 * @param {number} index
 */
const moveHookPvE = index => {

    const player = getSide($round.current);
    const board = $board.current.slice();

    setMove(index, player);
    board[index] = player; // see `pvp.js` [1]

    let countPlayer = countPaths(board, player);
    if (countPlayer.some(count => count >= 5)) {
        gameOver('你赢了！');
        return;
    }
    const ai = opposite(player);
    let countAI = countPaths(board, ai);

    const { move, won } = findMove(board, countAI, countPlayer);
    setMove(move, ai);
    board[move] = ai; // see `pvp.js` [1]
    if (won) {
        gameOver('你输了！');
        return;
    }

    countPlayer = countPaths(board, player);
    countAI = countPaths(board, ai);
    if (checkDraw(countPlayer, countAI)) {
        gameOver('平局！');
        return;
    }

    $round.set(round => round + 2); // continue

};
