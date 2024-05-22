import React from 'react';
import { Link } from 'react-router-dom';
import "../../App.css"

const MainLayout = ({ children, user}) => {
  return (
    <div>
     <header id="header" className="header">
    <div className="kbin-container">
      <nav className="head-nav">
        <menu className="head-nav__menu">
          <li>
            <Link to="/threads" className={window.location.pathname === '/threads' || window.location.pathname === '/' ? 'active' : ''}>
                Threads
            </Link>
          </li>
          <li>
            <Link to="/magazines" className={window.location.pathname === '/magazines' ? 'active' : ''}>
                Magazines
            </Link>
          </li>
        </menu>
      </nav>
      <menu>
        <li>
            <Link to="/search">
                <div style={{ transform: 'rotate(270deg)' }}>
                  <big>⌕</big>
                </div>
              </Link>
        </li>
        <li className="dropdown">
            <a href="#">
                <big><big>+</big></big>
              </a>
          <ul className="dropdown__menu">
            <li>
                <Link to="/threads/new">Add New Thread</Link>
            </li>
            <li>
                <Link to="/links/new">Add New Link</Link>
            </li>
            <li>
                <Link to="/magazines/new">Add New Magazine</Link>
            </li>
          </ul>
        </li>
        <li className="dropdown">
              {!user ? (
                <Link to="/login">Log in with API-KEY</Link>
              ) : (
                <>
                  <Link to={`/profile/${user.id}`}>{user.username}</Link>
                  <ul className="dropdown__menu">
                    <li>
                      <Link to={`/profile/${user.id}`}>Profile</Link>
                    </li>
                    <li>
                      <Link to={`/profile/edit/${user.id}`}>Edit Profile</Link>
                    </li>
                    <li>
                      <Link to="/logout">Log out</Link>
                    </li>
                  </ul>
                </>
              )}
            </li>
      </menu>
    </div>
  </header>
      <main>
        {children}
      </main>
      <footer>
        {/* Optional footer content */}
      </footer>
    </div>
  );
};

export default MainLayout;
