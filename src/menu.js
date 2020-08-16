import { h, SimpleButton } from './common.js';
import { initPvE } from './pve.js';
import { initPvP } from './pvp.js';

/**
 * @param {string} text
 * @param {() => void)} listener
 */
const MenuField = (text, listener) => (
    D.Section(null,
        SimpleButton(text, listener)
    )
);

export const menuContainer = D.Mask({
    id: 'menu-container',
},
    D.DialogWindow({
        id: 'menu-window',
        style: {
            textAlign: 'center',
            userSelect: 'none',
        },
    },
        h('h1', {
            style: {
                fontSize: '2em',
            },
        },
            D.Highlight(null, '五子棋'),
        ),
        MenuField('人机模式（先手）', () => {
            initPvE(true);
        }),
        MenuField('人机模式（后手）', () => {
            initPvE(false);
        }),
        MenuField('双人模式', initPvP),
        D.Link({
            href: 'https://github.com/huang2002/gobang',
        },
            'GitHub'
        )
    )
);

export const hideMenu = () => {
    menuContainer.style.display = 'none';
};

export const showMenu = () => {
    menuContainer.style.display = 'block';
};
