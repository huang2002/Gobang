import { h, BLACK, WHITE, BLANK } from './common.js';
import { patchBoard, createBoard } from './board.js';
import { confirmMove } from './toolbar.js';

const VIEW_SIZE = .9; // x100%
const CELL_SIZE = 7.69; // 100% / 13
const RESIZE_DELAY = 100;
const FOCUS_STROKE = '#000';
const LAST_MOVE_STROKE = '#36F';

const BLANK_SHADOW = 'inset 1px 1px 2px rgba(0,0,0,.3)';

const CHESS_REFLECTION = [ // css box-shadow
    'inset 2px 2px 2px rgba(255,255,255,.3)',
    'inset -2px -2px 2px rgba(0,0,0,.3)',
].join(',');

const FILL_STYLES = new Map([
    [BLACK, '#222'],
    [BLANK, '#DDD'],
    [WHITE, '#F6F6F6'],
]);

const STROKE_STYLES = new Map([
    [BLACK, '#111'],
    [BLANK, '#999'],
    [WHITE, '#333'],
]);

export const $selected = X.toReactive(-1);
export const $lastMove = X.toReactive(-1);

const $viewSizeInPixel = X.toReactive('300px');

let resizeTimer = null;

const resize = () => {
    resizeTimer = null;
    const rect = viewContainer.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) * VIEW_SIZE;
    $viewSizeInPixel.setSync(`${size}px`);
};

resizeTimer = setTimeout(resize, RESIZE_DELAY);

window.addEventListener('resize', () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(resize, RESIZE_DELAY);
});

export const $board = X.toReactive([]);

const CHESS_CLASS = X.createClass({
    display: 'inline-block',
    width: `${CELL_SIZE}%`,
    height: `${CELL_SIZE}%`,
    lineHeight: '0',
    border: 'solid 1px #CCC',
    borderRadius: '50%',
    transform: 'scale(.9)',
    outline: 'none',
});

const Chess = X.createComponent(
    /**
     * @param {X.ReactiveValue<import('./board.js').BoardStat>} $stat
     * @param {X.ReactiveValue<number>} $index
     */
    ($stat, $index) => (
        h('button', {
            class: CHESS_CLASS,
            style: {
                backgroundColor: $stat.map(stat => FILL_STYLES.get(stat)),
                borderColor: X.ReactiveValue.compose(
                    [$stat, $selected, $lastMove],
                    ([stat, selected, lastMove]) => (
                        lastMove === $index.current
                            ? LAST_MOVE_STROKE
                            : (
                                selected === $index.current
                                    ? FOCUS_STROKE
                                    : STROKE_STYLES.get(stat)
                            )

                    )
                ),
                boxShadow: $stat.map(
                    stat => stat === BLANK ? BLANK_SHADOW : CHESS_REFLECTION
                ),
            },
            listeners: {
                click() {
                    $selected.setSync($index.current);
                },
                dblclick() {
                    $selected.setSync($index.current);
                    confirmMove();
                },
            },
        })
    )
);

const view = $board.toElement('div', {
    id: 'view',
    style: {
        margin: 'auto',
        width: $viewSizeInPixel,
        height: $viewSizeInPixel,
        lineHeight: '0',
    },
},
    Chess // mapper
);

export const viewContainer = h('div', {
    id: 'view-container',
    style: {
        display: 'flex',
        flex: '1',
        overflow: 'hidden',
    },
},
    view,
);

export const resetBoard = () => {
    patchBoard($board, createBoard(BLANK));
    $selected.setSync(-1);
    $lastMove.setSync(-1);
};

/**
 * @param {number} index
 * @param {import('./board.js').BoardStat} side
 */
export const setMove = (index, side) => {
    $board.replace(index, side);
    $lastMove.setSync(index);
};
