import React, { useEffect, useState, useCallback } from 'react';
import Menu from './Menu';
import Filters from './Filters';
import Thread from './Thread';
import { getThreads } from '../../services/api';

// Stub de momento
const user = {
  id: 1,
  username: 'example_user',
  isAuthenticated: true,
};

const ThreadList = () => {
  // order: state and setOrder: function to update the state
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all');  // all, links, threads
  const [threads, setThreads] = useState([]); // Estado para almacenar los threads obtenidos
  const [error, setError] = useState(null); // Estado para manejar errores

  // useCallback: evita potenciales bucles infinitos de renderizado
  const fetchThreads = useCallback(async () => {
    setError(null); // Resetea cualquier error previo
    try {
      const data = await getThreads(filter, order, user.isAuthenticated); // Llama a la API con los parámetros actuales
      const threadsWithTime = data.map(thread => ({
        ...thread,
        time_since_creation: timeElapsed(thread.created_at),
        time_since_update: timeElapsed(thread.updated_at),
        is_edited: isEdited(thread.created_at, thread.updated_at),
      }));
      setThreads(threadsWithTime); // Actualiza el estado de los threads con los datos obtenidos
    } catch (error) {
      setError('Failed to fetch threads');
    }
  }, [filter, order]); // Dependencias: `filter` y `order`

  useEffect(() => { // Efecto secundario para obtener los threads
    fetchThreads(); // Ejecuta la función para obtener los threads
  }, [fetchThreads]); // Dependencias: vuelve a ejecutar el efecto si `order` o `filter` cambian

  if (error) {
    return <div>{error}</div>;
  }

  const isActive = (value, type) => {
    if (type === 'order' && order === value) {
      return 'active';
    }
    if (type === 'filter' && filter === value) {
      return 'active';
    }
    return '';
  }

  return (
    <div className="theme--dark">
      <div id="middle" className="page-entry-front">
        <div className="kbin-container">
          <main id="main" className="view-compact">
            <aside className="options options--top" id="options">
              <Menu setOrder={setOrder} isActive={isActive} />
              <Filters setFilter={setFilter} isActive={isActive} />
            </aside>
            <div id="content">
              {threads.map(thread => (
                <Thread key={thread.id} thread={thread} user={user} reloadThreads={fetchThreads} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

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

export default ThreadList;
