import { h, SimpleButton, BLANK } from './common.js';
import { $board, $selected } from './view.js';
import { showMenu } from './menu.js';
import { $round } from './header.js';

const HELP_INFO = '落子方法：先点击棋盘选择落子位置，然后点击“确认落子”或按下回车键；直接双击棋盘亦可。';
const BACK_CONFIRM = '对局尚未结束，确认要返回主菜单吗？';
const GAME_OVER_DELAY = 100;

export const $gameOver = X.toReactive(false);

/**
 * @param {string} msg
 */
export const gameOver = msg => {
    $gameOver.setSync(true);
    setTimeout(alert, GAME_OVER_DELAY, msg);
};

export const $moveHook = X.toReactive(
    /**
     * @param {number} index
     */
    index => {
        alert('内部错误');
    }
);

export const $withdrawHook = X.toReactive(() => {
    alert('内部错误');
});

export const confirmMove = () => {
    if ($gameOver.current) {
        alert('本局已经结束；点击“返回”回到主菜单。');
        return;
    }
    const { current: currentBoard } = $board;
    const { current: index } = $selected;
    if (currentBoard[index] !== BLANK) {
        alert('非法落子');
    } else {
        $moveHook.current(index);
    }
};

window.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        confirmMove();
    }
});

export const toolbar = h('div', {
    id: 'toolbar',
    style: {
        textAlign: 'center',
        padding: '1em 0',
        userSelect: 'none',
    },
},
    SimpleButton('帮助', () => {
        alert(HELP_INFO);
    }),
    SimpleButton('确认落子', confirmMove),
    SimpleButton('悔棋', () => {
        $withdrawHook.current();
    }),
    SimpleButton('返回', () => {
        if ($gameOver.current || $round.current === 1 || confirm(BACK_CONFIRM)) {
            showMenu();
        }
    }),
);
