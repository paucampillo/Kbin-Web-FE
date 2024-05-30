import React from 'react';
import { useLocation } from 'react-router-dom';

const OptionsMenu = ({ profileUser, threadsCount, commentsCount, boostsCount }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  console.log(location.pathname)
  if (!profileUser || !profileUser.user) {
    return null; // O algún tipo de indicador de carga
  }

  return (
    <aside className="options" id="options">
      <div></div>
      <menu className="options__main">
        <li>
          <a href={`/profile/${profileUser.user.id}/threads`} className={isActive(`/profile/${profileUser.user.id}/threads`) || isActive(`/profile/${profileUser.user.id}`)}>
            threads ({threadsCount})
          </a>
        </li>
        <li>
          <a href={`/profile/${profileUser.user.id}/comments`} className={isActive(`/profile/${profileUser.user.id}/comments`)}>
            comments ({commentsCount})
          </a>
        </li>
        {(
          <li>
            <a href={`/profile/${profileUser.user.id}/boosts`} className={isActive(`/profile/${profileUser.user.id}/boosts`)}>
              boosts ({boostsCount})
            </a>
          </li>
        )}
      </menu>
    </aside>
  );
};

export default OptionsMenu;
