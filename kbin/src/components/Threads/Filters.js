import React from 'react';

const Filters = ({ setFilter, isActive }) => (
    <menu className="options__filters">
    <li className="dropdown">
        <button aria-label="Filter by type" title="Filter by type">
            <span>&#9660;</span>
            Filter by type
        </button>
        <ul className="dropdown__menu">
        <li>
            <a href="#" className={isActive('all', 'filter')} onClick={() => setFilter('all')}>
                all
            </a>
        </li>
        <li>
            <a href="#" className={isActive('links', 'filter')} onClick={() => setFilter('links')}>
                links
            </a>
        </li>
        <li>
            <a href="#" className={isActive('threads', 'filter')} onClick={() => setFilter('threads')}>
                threads
            </a>
        </li>
        </ul>
    </li>
    </menu>
);

export default Filters;
