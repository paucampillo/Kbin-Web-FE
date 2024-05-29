import React from 'react';

const Comments = ({ comments, user }) => {
  return (
    <div id="look-comments">
      <div id="content">
        {comments.length > 0 ? (
          <section id="comments" className="comments entry-comments comments-tree">
            {comments.map(comment => (
              <blockquote
                key={comment.id}
                className="section comment entry-comment subject comment-level--1"
                id={`entry-comment-${comment.id}`}
                data-controller="comment subject mentions"
              >
                <header>
                  {comment.author && comment.author.username ? (
                    <a href={`/profile/${comment.author.id}/`} className="user-inline">
                      {comment.author.username}
                    </a>
                  ) : (
                    'Unknown author'
                  )}
                  , <time className="timeago" title={comment.created_at} datetime={comment.created_at}>
                    {new Date(comment.created_at).toLocaleString()}
                  </time>
                  ago to
                  {comment.thread_id ? (
                    <a href={`/thread/${comment.thread_id}`} className="magazine-inline">
                      {comment.thread_id}
                    </a>
                  ) : (
                    'Unknown thread'
                  )}
                  in
                  {comment.magazine && comment.magazine.name ? (
                    <a href={`/magazine/${comment.magazine.id}`} className="magazine-inline">
                      {comment.magazine.name}
                    </a>
                  ) : (
                    'Unknown magazine'
                  )}
                </header>
                <figure>
                  <a href={`/u/${comment.author.username}`}><div className="no-avatar"></div></a>
                </figure>
                <div className="content">
                  <p>{comment.body}</p>
                </div>
                <aside className="vote">
                  <form method="post" action={`/comment_vote/${comment.id}`} className="vote__up">
                    <input type="hidden" name="comment_id" value={comment.id} />
                    <input type="hidden" name="vote_type" value="like" />
                    <button type="submit" name="like_button" title="Favorite" aria-label="Favorite">
                      <span>{comment.num_likes}</span>
                      <span>&#128077;</span>
                    </button>
                  </form>
                  <form method="post" action={`/comment_vote/${comment.id}`} className="vote__down">
                    <input type="hidden" name="comment_id" value={comment.id} />
                    <input type="hidden" name="vote_type" value="dislike" />
                    <button type="submit" name="dislike_button" title="Reduce" aria-label="Reduce">
                      <span>{comment.num_dislikes}</span>
                      <span>&#128078;</span>
                    </button>
                  </form>
                </aside>
                <footer>
                  <menu>
                    <li>
                      <a href={`/reply_comment/${comment.thread_id}/${comment.id}`} className="edit-comment-link">
                        reply
                      </a>
                    </li>
                    {comment.author && comment.author.id === user.id && (
                      <>
                        <li>
                          <a href={`/comment_edit/${comment.thread_id}/${comment.id}`} className="edit-comment-link">
                            Edit
                          </a>
                        </li>
                        <li>
                          <form action={`/comment_delete/${comment.id}/${comment.thread_id}`} method="post">
                            <input type="submit" value="Delete" />
                          </form>
                        </li>
                      </>
                    )}
                  </menu>
                </footer>
              </blockquote>
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
    </div>
  );
};

export default Comments;
