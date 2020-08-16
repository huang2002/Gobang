export const { createElement: h } = X;

export const BOARD_SIZE = 13;

export const BLACK = 1;
export const BLANK = 0;
export const WHITE = -1;

/**
 * @param {import('./board.js').BoardStat} side
 */
export const opposite = side => side === BLACK ? WHITE : BLACK;

export const SIDE_NAMES = new Map([
    [BLACK, '黑'],
    [WHITE, '白'],
]);

/**
 * @param {number} round
 */
export const getSide = round => round % 2 ? BLACK : WHITE;

export const VALUES = new Map([
    [0, 0],
    [1, 1],
    [2, 10],
    [3, 100],
    [4, 1000],
]);

/**
 * @param {string} text
 * @param {() => void)} listener
 */
export const SimpleButton = (text, listener) => (
    D.Button({
        listeners: {
            click: listener,
        },
    },
        text
    )
);

/**
 * @type {<T>(array: T[]) => T}
 */
export const choice = array => (
    array[Math.floor(array.length * Math.random())]
);

/**
 * @param {number} x
 * @param {number} y
 */
export const pos2index = (x, y) => y * BOARD_SIZE + x;
