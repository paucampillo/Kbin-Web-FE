import React, { useState, useEffect,useCallback} from 'react';
import { Link } from 'react-router-dom';
import Menu from '../Threads/Menu';
import Filters from '../Threads/Filters';
import Thread from '../Threads/Thread';
import { getMagazineThreads, subscribeToMagazine, unsubscribeFromMagazine } from '../../services/api';

const user = {
  id: 1,
  username: 'example_user',
};

const MagazineDetail = ({ magazine }) => {
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all');  // all, links, threads
  const [threads, setThreads] = useState([]); // Estado para almacenar los threads obtenidos
  const [isSubscribed, setIsSubscribed] = useState(magazine.user_has_subscribed);
  const [subscriptionsCount,setSubscriptionsCount] = useState(magazine.subscriptions_count);
  const [error, setError] = useState(null);


  const fetchThreads = useCallback(async () => {
    setError(null); // Resetea cualquier error previo
    try {
      const data = await getMagazineThreads(magazine.id, filter, order); // Llama a la API con los parámetros actuales
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
  }, [magazine.id, filter, order]); // Dependencias: `magazine.id`, `filter`, `order`

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]); // Llama a `fetchThreads` cuando cambian las dependencias

  const handleSubscription = async (e) => {
    e.preventDefault();
    try {
      if (isSubscribed) {
        await unsubscribeFromMagazine(magazine.id);
        setIsSubscribed(false);
        setSubscriptionsCount(subscriptionsCount - 1);
      } else {
        await subscribeToMagazine(magazine.id);
        setIsSubscribed(true);
        setSubscriptionsCount(subscriptionsCount + 1);
        
      }
    } catch (error) {
      setError('Failed to update subscription');
    }
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

  return (
    <main>
      <div id="middle" className="page-user page-user-overview">
        <div className="kbin-container">
          <div id="main" data-controller="lightbox timeago">
            <div className="section section--top">
              <section className="magazine section">
                <h4>Magazine</h4>
                <hr />
                <div className="row">
                  <header>
                    <h4>
                      <Link to={`/magazine/${magazine.id}`}>
                        {magazine.name}
                      </Link>
                    </h4>
                    <p className="magazine__name">{magazine.title}</p>
                  </header>
                </div>
                <aside className="magazine__subscribe" data-controller="subs">
                  <div className="action">
                    <span>{subscriptionsCount}</span>
                  </div>
                  <form onSubmit={handleSubscription}>
                    <button type="submit" className="btn btn__secondary action" data-action="subs#send">
                      
                      <span>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span>
                    </button>
                  </form>
                </aside>
                <hr />
                <div className="content magazine__description">
                  <h3>About Community</h3>
                  <p>{magazine.description}</p>
                </div>
                <hr />
                <h4 className="mt-3">Rules</h4>
                <div className="content magazine__rules">
                  <p>{magazine.rules}</p>
                </div>
                <hr />
                <ul className="info">
                  <li>Created: <time className="timeago">{magazine.publish_date}</time></li>
                  <li>Owner: 
                    <span>
                      <Link to={`/profile/${magazine.author.id}`} className="user-inline">
                        <img width="30" height="30" src={magazine.author.avatar} alt="avatar" />
                        {magazine.author.username}
                      </Link>
                    </span>
                  </li>
                  <li>Subscribers: <span>{subscriptionsCount}</span></li>
                  <li>
                    <Link to={`/magazine/${magazine.id}/threads`}>
                      Threads:
                    </Link> 
                    <span>{magazine.threads_count}</span>
                  </li>
                  <li>Comments: <span>{magazine.comments_count}</span></li>
                </ul>
              </section>
            </div>
            <aside className="options options--top" id="options">
              <Menu setOrder={setOrder} isActive={isActive} />
              <Filters setFilter={setFilter} isActive={isActive} />
            </aside>
            <div id="content">
              {error && <p>{error}</p>}
              {threads.map(thread => (
                <Thread key={thread.id} thread={thread} user={user} reloadThreads={fetchThreads}/>
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer id="footer"></footer>
    </main>
  );
};

export default MagazineDetail;
