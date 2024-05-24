import React, { useState, useEffect } from 'react';
import { getMagazines, subscribeToMagazine, unsubscribeFromMagazine } from '../../services/api';

const Magazines = () => {
  const [magazines, setMagazines] = useState([]);
  const [orderby, setOrderby] = useState('subscriptions_count');

  useEffect(() => {
    const fetchMagazinesData = async () => {
      try {
        const data = await getMagazines(orderby);
        console.log('Data from getfaaa:', data); // Print data to console
        setMagazines(data);
      } catch (error) {
        console.error('Error fetching magazines:', error);
      }
    };

    fetchMagazinesData();
  }, [orderby]);

  const handleSubscription = async (magazineId, action) => {
    try {
      if (action === 'subscribe') {
        await subscribeToMagazine(magazineId);
      } else {
        await unsubscribeFromMagazine(magazineId);
      }
      const data = await getMagazines(orderby);
      setMagazines(data);
    } catch (error) {
      console.error(`Error ${action}ing magazine:`, error);
    }
  };

  return (
    <main>
      <div id="middle" className="page-magazines page-settings">
        <div className="kbin-container">
          <MagazineTable
            magazines={magazines}
            orderby={orderby}
            setOrderby={setOrderby}
            handleSubscription={handleSubscription}
          />
        </div>
      </div>
    </main>
  );
};

const MagazineTable = ({ magazines, orderby, setOrderby, handleSubscription }) => {
  const handleOrderbyChange = (field) => {
    setOrderby(field);
  };

  return (
    <main id="main" className="">
      <header>
        <h1 hidden>Magazines</h1>
      </header>
      <div id="content">
        <div className="section">
          <div className="magazines table-responsive">
            <table>
              <MagazineTableHeader orderby={orderby} handleOrderbyChange={handleOrderbyChange} />
              <MagazineTableBody
                magazines={magazines}
                handleSubscription={handleSubscription}
              />
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

const MagazineTableHeader = ({ orderby, handleOrderbyChange }) => {
  const handleOrderByClick = (field) => {
    handleOrderbyChange(field);
  };

  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>
          <a href="#threads" onClick={() => handleOrderByClick('threads')}>
            Threads {orderby === 'threads' ? '↓' : ''}
          </a>
        </th>
        <th>
          <a href="#comments" onClick={() => handleOrderByClick('comments')}>
            Comments {orderby === 'comments' ? '↓' : ''}
          </a>
        </th>
        <th style={{ textAlign: 'center' }}>
          <a href="#subscription" onClick={() => handleOrderbyChange('subscriptions_count')}>
            Subscriptions {orderby === 'subscriptions_count' ? '↓' : ''}
          </a>
        </th>
      </tr>
    </thead>
  );
};

const MagazineTableBody = ({ magazines, handleSubscription }) => {
  return (
    <tbody>
      {magazines.map((magazine) => (
        <tr key={magazine.id}>
          <td>
            <a href={`/magazines/${magazine.id}`} className="magazine-inline stretched-link">
              {magazine.name}
            </a>
          </td>
          <td>{magazine.threads_count}</td>
          <td>{magazine.comments_count}</td>
          <td>
            <aside className="magazine__subscribe">
              <div className="action">
                <span>{magazine.subscriptions_count}</span>
              </div>
              <MagazineSubscriptionForm
                magazineId={magazine.id}
                handleSubscription={handleSubscription}
                isSubscribed={magazine.user_has_subscribed}
              />
            </aside>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

const MagazineSubscriptionForm = ({ magazineId, handleSubscription, isSubscribed }) => {
  const handleSubmit = (e, action) => {
    e.preventDefault();
    handleSubscription(magazineId, action);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, isSubscribed ? 'unsubscribe' : 'subscribe')}>
      <button type="submit" className="btn btn__secondary action">
        <span>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span>
      </button>
    </form>
  );
};

export default Magazines;
