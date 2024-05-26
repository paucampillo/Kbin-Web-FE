// SearchResults.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ThreadsList from '../Threads/ThreadList';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const threads = location.state?.threads || [];

  useEffect(() => {
    console.log('Search results:', threads);
    console.log('Search query:', query);
  }, [threads, query]);

  return (
    <main>
      <div className="section section--top">
        <div className="kbin-container">
          <main id="main" className="view-compact">
            <form method="get" action="/search/results">
              <div className="flex" style={{ alignItems: 'center' }}>
                <input
                  value={query}
                  type="text"
                  name="query"
                  className="form-control"
                  placeholder="Type search term"
                  autoFocus
                  disabled
                />
                <button className="btn btn__primary" type="submit" aria-label="Search" disabled>
                  <div style={{ transform: 'rotate(270deg)' }}>
                    <big>⌕</big>
                  </div>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      {threads.length > 0 ? (
        <ThreadsList threads={threads} />
      ) : (
        <div className="overview subjects comments-tree comments show-post-avatar">
          <aside className="section section--muted">
            <p>No se encontraron resultados.</p>
          </aside>
        </div>
      )}
    </main>
  );
};

export default SearchResults;
