import React, { useEffect, useState } from 'react';
import { deleteReply, getComments, likeReply, unlikeReply, dislikeReply, undislikeReply } from '../../services/api';

const CommentBlock = ({ comment, level, user, fetchComments, orderBy }) => {

    const [replies, setReplies] = useState(comment.replies || []);
    const borderStyle = level > 10 ? { borderLeft: '1px solid #7e8f99', marginLeft: `calc(${level} * 1rem)` } : {};

    useEffect(() => {
        setReplies(comment.replies || []);
    }, [comment.replies]);


    const handleDeleteReply = async (reply_id) => {
        try {
            await deleteReply(reply_id);
            console.log('Reply deleted successfully');
            const updatedComments = await getComments(comment.thread_id, 'top', user.isAuthenticated);
            const updatedComment = updatedComments.find(c => c.id === comment.id);
            setReplies(updatedComment ? updatedComment.replies : []);
            await fetchComments();
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const handleLikeReply = async (reply_id) => {
        try {
            if (comment.user_has_liked) {
                await unlikeReply(reply_id);
                setReplies(replies.map(reply => reply.id === reply_id ? { ...reply, user_has_liked: false } : reply));
            } else {
                await likeReply(reply_id);
                setReplies(replies.map(reply => reply.id === reply_id ? { ...reply, user_has_liked: true } : reply));
            }
            fetchComments(orderBy);
        } catch (error) {
            console.error('Error liking reply:', reply_id, error);
        }
    };

    const handleDislikeReply = async (reply_id) => {
        try {
            if (comment.user_has_disliked) {
                await undislikeReply(reply_id);
                setReplies(replies.map(reply => reply.id === reply_id ? { ...reply, user_has_disliked: false } : reply));
            } else {
                await dislikeReply(reply_id);
                setReplies(replies.map(reply => reply.id === reply_id ? { ...reply, user_has_disliked: true } : reply));
            }
            fetchComments(orderBy);
        } catch (error) {
            console.error('Error disliking reply:', reply_id, error);
        }
    };

    return (
        <blockquote className={`section comment entry-comment subject comment-level--${level} comment-has-children`} id={`entry-comment-${comment.id}`} data-controller="comment subject mentions" data-subject-parent-value="{{ parent_comment_id }}" data-action="" style={borderStyle}>
            <header>
                <a href={`/profile/${comment.author.id}/`} className="user-inline" title={comment.author.username}>
                    {comment.author.username}
                </a>
                , <time className="timeago" title={comment.created_at} dateTime={comment.created_at}>{comment.time_since_creation}</time>
                {comment.is_edited && (
                    <span className="edited">
                        (edited <time className="timeago" title={comment.updated_at}>{comment.time_since_update}</time>)
                    </span>
                )}
            </header>

            <figure>
                <a href={`/u/${comment.author.username}`} data-action="mouseover->mentions#user_popup mouseout->mentions#user_popup_out" data-mentions-username-param="{{ comment.author }}">
                    <div className="no-avatar"></div>
                </a>
            </figure>

            <div className="content">
                <p>{comment.body}</p>
            </div>

            <aside className="vote">
                <button className="vote__up" onClick={() => handleLikeReply(comment.id)} title="Favorite" aria-label="Favorite">
                    <span style={{ color: comment.user_has_liked ? '#13F30B' : 'inherit' }}>{comment.num_likes}</span>
                    <span role="img" aria-label="thumbs up">👍</span>
                </button>

                <button className="vote__down" onClick={() => handleDislikeReply(comment.id)} title="Reduce" aria-label="Reduce">
                    <span style={{ color: comment.user_has_disliked ? '#F30B0B' : 'inherit' }}>{comment.num_dislikes}</span>
                    <span role="img" aria-label="thumbs down">👎</span>
                </button>
            </aside>

            <footer>
                <menu>
                    <li>
                        <a href={`/reply_comment/${comment.thread_id}/${comment.parent_comment || comment.id}/${comment.id}`} className="edit-comment-link">
                            reply
                        </a>
                    </li>
                    {comment.author.username === user.username && (
                        <>
                            <li>
                                <a href={`/reply_edit/${comment.thread_id}/${comment.parent_comment || comment.id}/${comment.id}`} className="edit-comment-link">
                                    Edit
                                </a>
                            </li>
                            <li>
                                <button type="submit" onClick={() => handleDeleteReply(comment.id)}>
                                    Delete
                                </button>
                            </li>
                        </>
                    )}
                </menu>
            </footer>

            {replies && replies.length > 0 &&
                replies.map(reply => (
                    <CommentBlock 
                        key={reply.id} 
                        comment={reply} 
                        level={level + 1} 
                        parentCommentId={comment.id} 
                        user={user}
                        fetchComments={fetchComments}
                        orderBy={orderBy}
                    />
                ))
            }
        </blockquote>
    );
};

export default CommentBlock;
