import { h, SIDE_NAMES, getSide } from './common.js';

export const $round = X.toReactive(1);

export const header = D.Section({
    style: {
        textAlign: 'center',
        userSelect: 'none',
    },
},
    h('h1', {
        style: {
            fontSize: '2em',
        },
        class: D.HIGHLIGHT_CLASS,
    },
        $round.map(
            round => `第${round}手 - 请${SIDE_NAMES.get(getSide(round))}棋落子`
        )
    )
);
