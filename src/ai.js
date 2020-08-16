import { createBoard } from './board.js';
import { PATHS, walkPath } from './path.js';
import { VALUES, BLANK, choice, pos2index } from './common.js';

export const FIRST_MOVE = pos2index(6, 6); // G7

/**
 * @param {import('./board.js').Board} board
 * @param {number[]} countSelf
 * @param {number[]} countOpponent
 */
export const findMove = (board, countSelf, countOpponent) => {

    const valueBoard = createBoard(0);

    try {
        PATHS.forEach((path, i) => {
            if (countSelf[i] * countOpponent[i] === 0) {
                const maxCount = Math.max(countSelf[i], countOpponent[i]);
                if (countSelf[i] === 4) {
                    throw path;
                }
                walkPath(path, (x, y) => {
                    valueBoard[pos2index(x, y)] += VALUES.get(maxCount);
                });
            }
        });
    } catch (path) {
        const candidateMoves = [];
        walkPath(path, (x, y) => {
            const index = pos2index(x, y);
            if (board[index] === BLANK) {
                candidateMoves.push(index);
            }
        });
        return {
            move: choice(candidateMoves),
            won: true,
        };
    }

    const candidateMoves = [];
    let maxValue = 0;
    valueBoard.forEach((value, index) => {
        if (board[index] !== BLANK) {
            return;
        }
        if (value > maxValue) {
            maxValue = value;
            candidateMoves.length = 0;
            candidateMoves.push(index);
        } else if (value === maxValue) {
            candidateMoves.push(index);
        }
    });

    return {
        move: choice(candidateMoves),
        won: false,
    };

};
