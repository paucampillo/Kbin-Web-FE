import React, { useState } from 'react';
import { createComment } from '../../services/api';

const CommentForm = ({ thread_id }) => {
  const [body, setBody] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newComment = { thread: thread_id, body };
    await createComment(newComment);
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
