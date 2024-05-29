import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getUserInfo, getUserThreads, getUserBoosts, getUserComments } from '../../services/api'; // Adjust the import according to your file structure
import UserHeader from './UserHeader';
import OptionsMenu from './OptionsMenu';
import Menu from '../Threads/Menu';
import Filters from '../Threads/Filters';
import Thread from '../Threads/Thread';
import Comments from './Comments';

const user = {
  id: 1,
  username: 'example_user',
  isAuthenticated: true,
};

const UserProfile = () => {
  const location = useLocation();
  const [profileUser, setProfileUser] = useState({});
  const [threads, setThreads] = useState([]);
  const [comments, setComments] = useState([]);
  const [boosts, setBoosts] = useState([]);

  const { userId } = useParams(); // Assuming you're using a route parameter for userId
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all');  // all, links, threads
  const [error, setError] = useState(null); // Estado para manejar errores

  const isThreadsPage = location.pathname.includes('threads') || location.pathname === `/profile/${userId}`;
  const isBoostsPage = location.pathname.includes('boosts');
  const isCommentsPage = location.pathname.includes('comments');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileUserInfo = await getUserInfo(userId);
        setProfileUser(profileUserInfo);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const fetchThreads = useCallback(async () => {
    setError(null); // Resetea cualquier error previo
    try {
      const profileThreads = await getUserThreads(userId, filter, order);
      const profileBoosts = await getUserBoosts(userId);
      const profileComments = await getUserComments(userId);

      const threadsWithTime = profileThreads.map(thread => ({
        ...thread,
        time_since_creation: timeElapsed(thread.created_at),
        time_since_update: timeElapsed(thread.updated_at),
        is_edited: isEdited(thread.created_at, thread.updated_at),
      }));

      setThreads(threadsWithTime);
      setBoosts(profileBoosts);
      setComments(profileComments);
    } catch (error) {
      setError('Failed to fetch threads');
    }
  }, [filter, order, userId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  if (error) {
    return <div>{error}</div>;
  }

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
  };

  return (
    <div className="theme--dark" data-controller="kbin notifications" data-turbo="false">
      <main>
        <div id="middle" className="page-user page-user-overview">
          <div className="kbin-container">
            <main id="main" data-controller="lightbox timeago" className="">
              <UserHeader profileUser={profileUser} />
              <OptionsMenu profileUser={profileUser} threadsCount={threads.length} commentsCount={comments.length} boostsCount={boosts.length} />
              {isThreadsPage && (
                <aside className="options options--top" id="options">
                  <Menu setOrder={setOrder} isActive={isActive} />
                  <Filters setFilter={setFilter} isActive={isActive} />
                </aside>
              )}
              <div id="content">
                {isThreadsPage && threads.map(thread => (
                  <Thread key={thread.id} thread={thread} user={user} reloadThreads={fetchThreads} />
                ))}
                {isBoostsPage && boosts.map(thread => (
                  <Thread key={thread.id} thread={thread} user={user} reloadThreads={fetchThreads} />
                ))}
                {isCommentsPage && <Comments comments={comments} user={user} />}
              </div>
            </main>
          </div>
        </div>
        <footer id="footer"></footer>
      </main>
      <footer>{/* Optional footer content */}</footer>
    </div>
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
