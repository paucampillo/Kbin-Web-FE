import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile } from '../../services/api'; // Adjust the import according to your file structure
import UserHeader from './UserHeader';
//import FilterMenu  from './FilterMenu';
import OptionsMenu from './OptionsMenu';
import Menu from '../Threads/Menu';
import Filters from '../Threads/Filters';
import Thread from '../Threads/Thread';

const user = {
  id: 1,
  username: 'example_user',
  isAuthenticated: true,
};

const UserProfile = () => {
  const [profileUser, setProfileUser] = useState({});
  const [threads, setThreads] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [boosts, setBoosts] = useState([]);

  //const [activeOrder, setActiveOrder] = useState('');
  //const [activeFilter, setActiveFilter] = useState('');
  const { userId } = useParams(); // Assuming you're using a route parameter for userId
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all');  // all, links, threads
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(userId);

        // Desestructurar los datos recibidos para obtener las partes necesarias
        const {threads, comments_count, boosts } = profileData;
        setProfileUser(profileData);
        setThreads(threads);
        console.log(threads)
        setCommentsCount(comments_count);
        setBoosts(boosts);
        //setActiveOrder(active_order);
        //setActiveFilter(active_filter);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);
  // useCallback: evita potenciales bucles infinitos de renderizado
  const fetchThreads = useCallback(async () => {
    setError(null); // Resetea cualquier error previo
    try {
      const threadsWithTime = threads.map(thread => ({
        ...thread,
        time_since_creation: timeElapsed(thread.created_at),
        time_since_update: timeElapsed(thread.updated_at),
        is_edited: isEdited(thread.created_at, thread.updated_at),
      }));
      setThreads(threadsWithTime); // Actualiza el estado de los threads con los datos obtenidos
    } catch (error) {
      setError('Failed to fetch threads');
    }
  }, [filter, order]);

  useEffect(() => { // Efecto secundario para obtener los threads
    fetchThreads(); // Ejecuta la función para obtener los threads
  }, [fetchThreads]); // Dependencias: vuelve a ejecutar el efecto si `order` o `filter` cambian


  if (!profileUser) {
    return <div>Loading...</div>;
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
    <body className="theme--dark" data-controller="kbin notifications" data-turbo="false">
      <main>
        <div id="middle" className="page-user page-user-overview">
          <div className="kbin-container">
            <main id="main" data-controller="lightbox timeago" className="">
              <UserHeader profileUser={profileUser} />
              <OptionsMenu profileUser={profileUser} threads={threads} commentsCount={commentsCount} boosts={boosts} />
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
        <footer id="footer"></footer>
      </main>
      <footer>{/* Optional footer content */}</footer>
    </body>
  );
};

export default UserProfile;

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