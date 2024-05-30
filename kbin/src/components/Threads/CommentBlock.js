import React, { useState } from 'react';
import { createComment, getComments } from '../../services/api'; // Asegúrate de importar getComments desde el lugar correcto

const CommentBlock = ({ comment, level, user }) => {

    const [replyBody, setReplyBody] = useState(''); // Define replyBody y setReplyBody como estados

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const replyData = {
            body: replyBody,
            thread_id: comment.thread_id, 
            parent_comment: comment.id || null,
            parent_reply: null,
        };
        try {
            const response = await createComment(replyData);
            console.log('Reply created successfully:', response);
            setReplyBody('');
            const updatedComments = await getComments(comment.thread_id, 'likes', user.isAuthenticated); // Corrige el orden en el que se pasan los parámetros
            setReplies(updatedComments);
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    };

    const [replies, setReplies] = useState([]); // Define replies como un estado

    const borderStyle = level > 10 ? { borderLeft: '1px solid #7e8f99', marginLeft: `calc(${level} * 1rem)` } : {};

    return (
        <blockquote className={`section comment entry-comment subject comment-level--${level} comment-has-children`} id={`entry-comment-${comment.id}`} data-controller="comment subject mentions" data-subject-parent-value="{{ parent_comment_id }}" data-action="" style={borderStyle}>
            <header>
                <a href={`/profile/${comment.author.id}/`} className="user-inline" title={comment.author.username}>
                    {comment.author.username}
                </a>
                , <time className="timeago" title={comment.created_at} dateTime={comment.created_at}>{ comment.time_since_creation }</time>
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
                        <a href={`/reply_comment/${comment.thread_id}/${comment.parent_comment || comment.id}/${comment.id}`} className="edit-comment-link">
                            reply
                        </a>
                    </li>
                    {comment.author.username === user.username && (
                        <>
                            <li>
                                <a href={`/reply_edit/${comment.thread_id}/${comment.id}`} className="edit-comment-link">
                                    Edit
                                </a>
                            </li>
                            <li>
                                <form action={`/reply_delete/${comment.id}/${comment.thread_id}`} method="post">
                                    <button type="submit">
                                        Delete
                                    </button>
                                </form>
                            </li>
                        </>
                    )}
                </menu>
            </footer>

            {comment.replies && comment.replies.length > 0 &&
                comment.replies.map(reply => 
                (reply.author === reply.user) && 
            <CommentBlock 
            key={reply.id} 
            comment={reply} 
            level={level + 1} 
            parentCommentId={comment.id} 
            user={user}
            />
        )
        }
        </blockquote>
    );
};

export default CommentBlock;
