import { resetBoard, $board, setMove } from './view.js';
import { hideMenu } from './menu.js';
import { $moveHook, $gameOver, gameOver } from './toolbar.js';
import { $round } from './header.js';
import { getSide, SIDE_NAMES, opposite } from './common.js';
import { countPaths, checkDraw } from './path.js';

export const initPvP = () => {
    $moveHook.setSync(moveHookPvP);
    $round.setSync(1);
    $gameOver.setSync(false);
    resetBoard();
    hideMenu();
};

/**
 * @param {number} index
 */
const moveHookPvP = index => {

    const self = getSide($round.current);
    const board = $board.current.slice();

    setMove(index, self);

    // [1]: the reactive list is updated asynchronously, but the
    // check is done synchronously, so here a copy of the board
    // stats is obtained and updated synchronously for checking
    board[index] = self;

    const countSelf = countPaths(board, self);
    if (countSelf.some(count => count >= 5)) {
        gameOver(`${SIDE_NAMES.get(self)}棋获胜！`);
    } else {
        const opponent = opposite(self);
        const countOpponent = countPaths(board, opponent);
        if (checkDraw(countSelf, countOpponent)) {
            gameOver('平局！');
        } else { // continue
            $round.set(round => round + 1);
        }
    }

};
