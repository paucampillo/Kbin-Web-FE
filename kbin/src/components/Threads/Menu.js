import React from 'react';

const Menu = ({ setOrder, isActive }) => (
    <menu className="options__main no-scroll">
    <li>
        <a href="#" className={isActive('points', 'order')} onClick={() => setOrder('points')}>
            top
        </a>
    </li>
    <li>
        <a href="#" className={isActive('created_at', 'order')} onClick={() => setOrder('created_at')}>
            newest
        </a>
    </li>
    <li>
        <a href="#" className={isActive('num_comments', 'order')} onClick={() => setOrder('num_comments')}>
            commented
        </a>
    </li>
    </menu>
);

export default Menu;
