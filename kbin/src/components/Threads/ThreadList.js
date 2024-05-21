import React, { useEffect, useState } from 'react';
import { getThreads } from '../../services/api';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const data = await getThreads();
      setThreads(data);
    };

    fetchThreads();
  }, []);

  return (
    <div>
      <h2>Threads</h2>
      <ul>
        {threads.map(thread => (
          <li key={thread.id}>{thread.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadList;
