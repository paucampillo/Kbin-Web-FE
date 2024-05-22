import React, { useEffect, useState } from 'react';
import { getComments } from '../../services/api';

const CommentList = ({ thread_id }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments(thread_id);
      setComments(data);
    };

    fetchComments();
  }, [thread_id]);

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
