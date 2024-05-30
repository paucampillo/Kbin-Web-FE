import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FilterMenu = ({ activeOrder, activeFilter }) => {
  const location = useLocation();

  return location.pathname.includes('/threads') || location.pathname.includes('/comments') ? (
    <aside className="options options--top" id="options">
      <menu className="options__main no-scroll">
        <li>
          <Link to={`?order_by=points&filter=${activeFilter}`} className={activeOrder === 'points' ? 'active' : ''}>
            top
          </Link>
        </li>
        <li>
          <Link to={`?order_by=created_at&filter=${activeFilter}`} className={activeOrder === 'created_at' ? 'active' : ''}>
            newest
          </Link>
        </li>
        <li>
          <Link to={`?order_by=num_comments&filter=${activeFilter}`} className={activeOrder === 'num_comments' ? 'active' : ''}>
            commented
          </Link>
        </li>
      </menu>

      <menu className="options__filters">
        <li className="dropdown">
          <button aria-label="Filter by type" title="Filter by type">
            <span>&#9660;</span> {/* Unicode arrow-down */}
            Filter by type
          </button>
          <ul className="dropdown__menu">
            <li>
              <Link to={`?filter=all&order_by=${activeOrder}`} className={activeFilter === 'all' ? 'active' : ''}>
                all
              </Link>
            </li>
            <li>
              <Link to={`?filter=links&order_by=${activeOrder}`} className={activeFilter === 'links' ? 'active' : ''}>
                links
              </Link>
            </li>
            <li>
              <Link to={`?filter=threads&order_by=${activeOrder}`} className={activeFilter === 'threads' ? 'active' : ''}>
                threads
              </Link>
            </li>
          </ul>
        </li>
      </menu>
    </aside>
  ) : null;
};

export default FilterMenu;
