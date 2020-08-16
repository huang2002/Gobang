import { h } from './common.js';
import { header } from './header.js';
import { viewContainer } from './view.js';
import { toolbar } from './toolbar.js';
import { menuContainer } from './menu.js';

document.body.appendChild(
    h('div', {
        id: 'app',
        style: {
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
        },
    },
        header,
        viewContainer,
        toolbar,
        menuContainer,
    )
);
