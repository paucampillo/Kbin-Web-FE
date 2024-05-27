import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { search } from '../../services/api';
import Thread from '../Threads/Thread';
import Menu from '../Threads/Menu';
import Filters from '../Threads/Filters';

// Stub de momento
const user = {
  id: 1,
  username: 'example_user',
};

const SearchList = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all'); // all, links, threads
  const [hasSearched, setHasSearched] = useState(false); // Estado para rastrear si se ha realizado una búsqueda
  const history = useHistory();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const results = await search(query);
      const resultsWithTime = results.map(thread => ({
        ...thread,
        time_since_creation: timeElapsed(thread.created_at),
        time_since_update: timeElapsed(thread.updated_at),
        is_edited: isEdited(thread.created_at, thread.updated_at),
      }));

      setSearchResults(resultsWithTime);
      setHasSearched(true); // Indicar que se ha realizado una búsqueda

      history.push({
        pathname: '/search/results',
        search: `?q=${query}`,
        state: { threads: resultsWithTime, query },
      });

    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Function to filter and sort the threads based on filter and order states
  const getFilteredAndSortedResults = () => {
    let filteredThreads = searchResults;

    if (filter !== 'all') {
      filteredThreads = filteredThreads.filter(thread => {
        if (filter === 'links') return thread.url;
        if (filter === 'threads') return !thread.url;
        return true;
      });
    }

    filteredThreads = filteredThreads.sort((a, b) => {
      if (order === 'points') return b.num_points - a.num_points;
      if (order === 'created_at') return new Date(b.created_at) - new Date(a.created_at);
      if (order === 'num_comments') return b.num_comments - a.num_comments;
      return 0;
    });

    return filteredThreads;
  };

  const isActive = (value, type) => {
    if (type === 'order' && order === value) {
      return 'active';
    }
    if (type === 'filter' && filter === value) {
      return 'active';
    }
    return '';
  };

  return (
    <div>
      <div className="section section--top">
        <div className="kbin-container">
          <main id="main" className="view-compact">
            <form onSubmit={handleSubmit}>
              <div className="flex" style={{ alignItems: 'center' }}>
                <input
                  value={query}
                  type="text"
                  name="q"
                  className="form-control"
                  placeholder="Type search term"
                  autoFocus
                  onChange={handleInputChange}
                />
                <button className="btn btn__primary" type="submit" aria-label="Search">
                  <div style={{ transform: 'rotate(270deg)' }}>
                    <big>⌕</big>
                  </div>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>

      {/* Renderiza la barra de filtros solo si se ha realizado una búsqueda */}
      {hasSearched && (
        <aside className="options options--top" id="options">
          <Menu setOrder={setOrder} isActive={isActive} />
          <Filters setFilter={setFilter} isActive={isActive} />
        </aside>
      )}

      <div>
        {hasSearched && searchResults.length === 0 ? (
          <div className="overview subjects comments-tree comments show-post-avatar">
            <aside className="section section--muted">
              <p>Empty</p>
            </aside>
          </div>
        ) : (
          getFilteredAndSortedResults().map((thread) => (
            <Thread key={thread.id} thread={thread} user={user} />
          ))
        )}
      </div>
    </div>
  );
};

const timeElapsed = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const timeDiff = Math.abs(now - createdDate);

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
};

const isEdited = (createdAt, updatedAt) => {
  return new Date(createdAt).getTime() !== new Date(updatedAt).getTime();
};

export default SearchList;
