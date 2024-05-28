import React from 'react';
import "../../App.css";

/* eslint-disable jsx-a11y/anchor-is-valid */
const MainLayout = ({ children, user }) => {
  return (
    <div>
      <header id="header" className="header">
        <div className="kbin-container">
          <nav className="head-nav">
            <menu className="head-nav__menu">
              <li>
                <a href="/threads" className={window.location.pathname === '/threads' || window.location.pathname === '/' ? 'active' : ''}>
                  Threads
                </a>
              </li>
              <li>
                <a href="/magazines" className={window.location.pathname === '/magazines' ? 'active' : ''}>
                  Magazines
                </a>
              </li>
            </menu>
          </nav>
          <menu>
            <li>
              <a href="/search">
                <div style={{ transform: 'rotate(270deg)' }}>
                  <big>⌕</big>
                </div>
              </a>
            </li>
            <li className="dropdown">
              <a href="#">
                <big><big>+</big></big>
              </a>
              <ul className="dropdown__menu">
                <li>
                  <a href="/threads/new">Add New Thread</a>
                </li>
                <li>
                  <a href="/links/new">Add New Link</a>
                </li>
                <li>
                  <a href="/magazines/new">Add New Magazine</a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              {!user ? (
                <a href="/login">Log in with API-KEY</a>
              ) : (
                <>
                  <a href={`/profile/${user.id}`}>{user.username}</a>
                  <ul className="dropdown__menu">
                    <li>
                      <a href={`/profile/${user.id}`}>Profile</a>
                    </li>
                    <li>
                      <a href={`/profile/edit/${user.id}`}>Edit Profile</a>
                    </li>
                    <li>
                      <a href="/logout">Log out</a>
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
