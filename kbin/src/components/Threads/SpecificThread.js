import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Thread from './Thread';
import CommentBlock from './CommentBlock';
import { getThread, getComments } from '../../services/api';

// Stub de momento
const user = {
    id: 1,
    username: 'example_user',
    isAuthenticated: true,
};

const SpecificThread = () => {
    const { thread_id } = useParams(); // Obtiene el thread_id de los parámetros de la URL
    const [thread, setThread] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    const fetchThread = useCallback(async () => {
        setError(null);
        try {
            const data = await getThread(thread_id, user.isAuthenticated);
            const threadWithTime = {
                ...data,
                time_since_creation: timeElapsed(data.created_at),
                time_since_update: timeElapsed(data.updated_at),
                is_edited: isEdited(data.created_at, data.updated_at),
            };
            setThread(threadWithTime);
        } catch (error) {
            setError('Failed to fetch thread');
        }
    }, [thread_id]);

    const fetchComments = useCallback(async () => {
        setError(null);
        try {
            const data = await getComments(thread_id, user.isAuthenticated);
            const commentsWithTime = data.map(comment => ({
                ...comment,
                time_since_creation: timeElapsed(comment.created_at),
                time_since_update: timeElapsed(comment.updated_at),
                is_edited: isEdited(comment.created_at, comment.updated_at),
            }));
            setComments(commentsWithTime);
        } catch (error) {
            setError('Failed to fetch comments');
        }
    }, [thread_id]);

    useEffect(() => {
        fetchThread();
        fetchComments();
    }, [fetchThread, fetchComments]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!thread) {
        return <div>Loading...</div>;
    }

    return (
        <body className="theme--dark">
            <main>

                <div id="content">
                    <Thread thread={thread} user={user} reloadThreads={fetchThread} showBody={true} />
                </div>

                <div id="comment-add" className="section">
                    <form action={`/create_comment/${thread.id}`} name="entry_comment" method="post" className="entry-create">
                        <label htmlFor="comment_body">Comment:</label>
                        <textarea id="comment_body" name="body"></textarea>
                        <div className="row actions">
                            <ul>
                                <li>
                                    <button type="submit" id="entry_comment_submit" name="entry_comment[submit]" className="btn btn__primary">Add comment</button>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>

                <div id="content">
                    {comments && comments.length > 0 ? (
                        <section id="comments" className="comments entry-comments comments-tree" data-controller="" data-action="">
                            <aside className="options options--top" id="options">
                                <menu className="options__main no-scroll">
                                    <li>
                                        <a href="?order_by=points" className="active">top</a>
                                    </li>
                                    <li>
                                        <a href="?order_by=newest">newest</a>
                                    </li>
                                    <li>
                                        <a href="?order_by=oldest">oldest</a>
                                    </li>
                                </menu>
                            </aside>
                            {comments.map(comment => (
                                <React.Fragment key={comment.id}>
                                    <blockquote className="section comment entry-comment subject comment-level--1" id={`entry-comment-${comment.id}`} data-controller="comment subject mentions" data-subject-parent-value="" data-action="">
                                        <header>
                                            <a href={`/profile/${comment.author.id}/`} className="user-inline" title={comment.author.username}>
                                                {comment.author.username}
                                            </a>
                                            , <time className="timeago" title={comment.created_at} dateTime={comment.created_at}>{comment.time_since_creation}</time>
                                            {comment.is_edited && (
                                                <span className="edited">
                                                    (edited <time className="timeago" title={comment.updated_at}>{comment.time_since_update} ago</time>)
                                                </span>
                                            )}
                                        </header>

                                        <figure>
                                            <a href={`/u/${comment.author.username}`}>
                                                <div className="no-avatar"></div>
                                            </a>
                                        </figure>

                                        <div className="content">
                                            <p>{comment.body}</p>
                                        </div>

                                        <aside className="vote">
                                            <form method="post" action={`/reply_vote/${comment.id}`} className="vote__up">
                                                <button type="submit" title="Favorite" aria-label="Favorite">
                                                    <span>{comment.num_likes}</span>
                                                    <span role="img" aria-label="thumb-up">&#128077;</span>
                                                </button>
                                            </form>

                                            <form method="post" action={`/reply_vote/${comment.id}`} className="vote__down">
                                                <button type="submit" title="Reduce" aria-label="Reduce">
                                                    <span>{comment.num_dislikes}</span>
                                                    <span role="img" aria-label="thumb-down">&#128078;</span>
                                                </button>
                                            </form>
                                        </aside>

                                        <footer>
                                            <menu>
                                                <li>
                                                    <a href={`/reply_comment/${comment.thread_id}/${comment.parent_comment || comment.id}/${comment.id}`} className="edit-comment-link">reply</a>
                                                </li>
                                                {comment.author.username === user.username && (
                                                    <>
                                                        <li>
                                                            <a href={`/reply_edit/${comment.thread_id}/${comment.id}`} className="edit-comment-link">Edit</a>
                                                        </li>
                                                        <li>
                                                            <form action={`/reply_delete/${comment.id}/${comment.thread_id}`} method="post">
                                                                <button type="submit">Delete</button>
                                                            </form>
                                                        </li>
                                                    </>
                                                )}
                                            </menu>
                                        </footer>
                                    </blockquote>
                                    {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                                        <CommentBlock key={reply.id} comment={reply} level={reply.reply_level + 1} user={user} parentReply={reply.parent_reply_id} profileView={false} />
                                    ))}
                                </React.Fragment>
                            ))}
                        </section>
                    ) : (
                        <div className="overview subjects comments-tree comments show-post-avatar">
                            <aside className="section section--muted">
                                <p>No comments</p>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </body>
    );
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

export default SpecificThread;
