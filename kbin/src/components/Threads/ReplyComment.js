import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createComment } from '../../services/api';

const ReplyComment = () => {
    const { thread_id, parent_comment_id, parent_reply_id } = useParams();
    const [body, setBody] = useState('');
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const replyData = {
            thread: thread_id,
            parent_comment: parent_comment_id,
            
            body: body,
        };

        if (parent_reply_id && parent_reply_id !== parent_comment_id) {
            replyData.parent_reply = parent_reply_id;
        }

        try {
            console.log('Creating reply:', replyData);
            const newReply = await createComment(replyData);
            console.log('Reply created successfully:', newReply);
            setBody('');
            // Redirect or update UI after successful reply creation
            window.location.href = `/thread/${thread_id}`;

        } catch (error) {
            console.error('Error creating reply:', error);
            setError('Failed to create reply');
        }
    };

    return (
        <div className="theme--dark">
            <div id="middle" className="page-entry-create page-entry-reply-comment">
                <div className="kbin-container">
                    <main id="main" className="view-compact">
                        <div id="content" className="section">
                            <div className="container">
                                <form onSubmit={handleSubmit} className="entry-reply">
                                    {error && <div className="error">{error}</div>}
                                    <div>
                                        <input
                                            type="hidden"
                                            name="parent_comment_id"
                                            value={parent_comment_id}
                                        />
                                        <input
                                            type="hidden"
                                            name="parent_reply_id"
                                            value={parent_reply_id}
                                        />
                                        <label htmlFor="body">Comment:</label>
                                        <textarea
                                            id="body"
                                            name="body"
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="row actions">
                                        <ul>
                                            <li>
                                                <div>
                                                    <button type="submit" className="btn btn__primary">
                                                        Reply comment
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ReplyComment;
