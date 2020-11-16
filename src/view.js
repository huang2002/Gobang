import { h, BLACK, WHITE, BLANK } from './common.js';
import { patchBoard, createBoard } from './board.js';
import { confirmMove, $gameOver } from './toolbar.js';
import { $round } from './header.js';

const VIEW_SIZE = .9; // x100%
const CELL_SIZE = 7.69; // 100% / 13
const RESIZE_DELAY = 100;
const FOCUS_STROKE = '#000';
const LAST_MOVE_STROKE = '#36F';

const BLANK_SHADOW = '0 0 1px #DDD';

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
    [BLANK, 'transparent'],
    [WHITE, '#333'],
]);

export const $selected = X.toReactive(-1);

const $history = X.toReactive([]);

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
    border: 'solid 2px #CCC',
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
                    [$stat, $selected, $history],
                    ([stat, selected, history]) => {
                        if (
                            history.length
                            && history[history.length - 1] === $index.current
                        ) {
                            return LAST_MOVE_STROKE;
                        } else {
                            return selected === $index.current
                                ? FOCUS_STROKE
                                : STROKE_STYLES.get(stat);
                        }
                    }
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
    $history.setSync([]);
};

/**
 * @param {number} index
 * @param {import('./board.js').BoardStat} side
 */
export const setMove = (index, side) => {
    $board.replace(index, side);
    $history.push(index);
};

/**
 * @param {number} count
 */
export const withdraw = (count = 1) => {
    const history = $history.current.slice();
    if (history.length < count) {
        return;
    }
    for (let i = 0; i < count; i++) {
        const lastMove = history.pop();
        $board.replace(lastMove, BLANK);
    }
    $round.set(round => round - count);
    $history.setSync(history);
    $gameOver.setSync(false);
};
