import { BOARD_SIZE, pos2index } from './common.js';

/**
 * @typedef {number} BoardStat
 */

/**
 * @typedef {BoardStat[]} Board
 */

/**
 * @param {BoardStat} init
 */
export const createBoard = init => (
    Array.from({ length: BOARD_SIZE ** 2 }, () => init)
);

/**
 *
 * @param {Board} board
 * @param {BoardStat} value
 */
export const fillBoard = (board, value) => {
    for (let i = 0; i < board.length; i++) {
        board[i] = value;
    }
};

/**
 * @param {number} x
 * @param {number} y
 */
export const getBoardStat = (board, x, y) => {
    return board[pos2index(x, y)];
};

/**
 * @param {X.ReactiveList<BoardStat>} $board
 * @param {Board} board
 */
export const patchBoard = ($board, board) => {
    const { current: currentBoard } = $board;
    board.forEach((stat, index) => {
        if (index >= currentBoard.length) { // fist run
            $board.push(stat);
        }
        if (currentBoard[index] !== stat) {
            $board.replace(index, stat);
        }
    });
};
