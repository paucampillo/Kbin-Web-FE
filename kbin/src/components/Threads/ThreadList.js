import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import Filters from './Filters';
import Thread from './Thread';
import { getThreads } from '../../services/api';

// Stub de momento
const user = {
  id: 1,
  username: 'example_user',
};

const ThreadList = () => {
  // order: state and setOrder: function to update the state
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all');  // all, links, threads
  const [threads, setThreads] = useState([]); // Estado para almacenar los threads obtenidos
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están siendo cargados
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => { // Efecto secundario para obtener los threads
    const fetchThreads = async () => {
      setLoading(true);
      setError(null); // Resetea cualquier error previo
      try {
        const data = await getThreads(filter, order); // Llama a la API con los parámetros actuales
        setThreads(data); // Actualiza el estado de los threads con los datos obtenidos
      } catch (error) {
        setError('Failed to fetch threads');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads(); // Ejecuta la función para obtener los threads
  }, [order, filter]); // Dependencias: vuelve a ejecutar el efecto si `order` o `filter` cambian

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
                <Thread key={thread.id} thread={thread} user={user} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ThreadList;
