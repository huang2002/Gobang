import { BOARD_SIZE } from './common.js';
import { getBoardStat } from './board.js';

const OFFSETS = [
    [5, 0],
    [0, 5],
    [5, 5],
    [-5, 5]
];

/**
 * @typedef {[number, number, number, number]} Path
 */

/**
 * @type {Path[]}
 */
export const PATHS = (() => {
    const paths = [];
    for (let y0 = 0; y0 < BOARD_SIZE; y0++) {
        for (let x0 = 0; x0 < BOARD_SIZE; x0++) {
            OFFSETS.forEach(offset => {
                const x1 = x0 + offset[0];
                const y1 = y0 + offset[1];
                // `y1 >= 0` is always true
                if (x1 >= -1 && x1 <= BOARD_SIZE && y1 <= BOARD_SIZE) {
                    paths.push([x0, y0, x1, y1]);
                }
            });
        }
    }
    return paths;
})();

/**
 * @param {import('./board.js').Board} board
 * @param {Path} path
 * @param {import('./board.js').BoardStat} side
 */
export const countPath = (board, path, side) => {
    let count = 0;
    walkPath(path, (x, y) => {
        if (getBoardStat(board, x, y) === side) {
            count++;
        }
    });
    return count;
};

/**
 * @param {import('./board.js').Board} board
 * @param {import('./board.js').BoardStat} side
 */
export const countPaths = (board, side) => (
    PATHS.map(path => countPath(board, path, side))
);

/**
 * @param {Path} path
 * @param {(x: number, y: number) => void} callback
 */
export const walkPath = (path, callback) => {
    const [x0, y0, x1, y1] = path;
    const dx = (x1 - x0) / 5;
    const dy = (y1 - y0) / 5;
    for (let i = 0; i < 5; i++) {
        callback(x0 + dx * i, y0 + dy * i);
    }
};

/**
 * @param {number[]} countA
 * @param {number[]} countB
 */
export const checkDraw = (countA, countB) => (
    countA.every((count, i) => count * countB[i] > 0)
);
