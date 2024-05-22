import React from 'react';

const Thread = ({ thread, user }) => {
    return (
        <article className="entry section subject no-image">
        <header>
            <h2>
                <a href={`/thread/${thread.id}`}>
                    {thread.title}
                </a>
                {thread.is_link && (
                    <span className="entry__domain">
                    {" "}(
                    <a href={thread.url} rel="nofollow noopener noreferrer">
                        {thread.url}
                    </a>
                    )
                    </span>
                )}
            </h2>
        </header>

        <aside className="meta entry__meta">
            <a href={`/profile/${thread.author.id}`} className="user-inline">
                {thread.author.username}
            </a>
            ,
            <time className="timeago" title={thread.created_at}>
            {" "}{thread.time_since_creation}
            </time>
            { thread.is_edited && (
            <span className="edited">
                {" "}(edited {" "}
                <time className="timeago" title={thread.updated_at}>
                {thread.time_since_update}
                </time>
                )
            </span>
            )}
            {" "}to
            <a href={`/magazine/${thread.magazine.id}`} className="magazine-inline">
                {thread.magazine.name}
            </a>
        </aside>

        <aside className="vote">
        <form action={`/api/threads/${thread.id}/vote`} method="post" className="vote__up">
            <input type="hidden" name="vote_type" value="like" />
            <button type="submit" name="like_button" title="Favorite" aria-label="Favorite">
                <span>{thread.num_likes}</span>
                <span role="img" aria-label="thumb-up">👍</span>
            </button>
        </form>

        <form action={`/api/threads/${thread.id}/vote`} method="post" className="vote__down">
            <input type="hidden" name="vote_type" value="dislike" />
            <button type="submit" name="dislike_button" title="Reduce" aria-label="Reduce">
                <span>{thread.num_dislikes}</span>
                <span role="img" aria-label="thumb-down">👎</span>
            </button>
        </form>
        </aside>

        <footer>
        <menu>
            <li>
            <a className="stretched-link" href={`/thread/${thread.id}#look-comments`}>
                <span>{thread.num_comments}</span> comments
            </a>
            </li>
            <li>
            <form action={`/api/threads/${thread.id}/boost`} method="post">
                <input type="hidden" name="thread_id" value={thread.id} />
                <button className="boost-link stretched-link" type="submit">
                boost {thread.num_points > 0 && <span>({thread.num_points})</span>}
                </button>
            </form>
            </li>
            {thread.author.id === user.id && (
            <>
                <li>
                    <a href={`/thread/${thread.id}/edit`}>Edit Thread or Link</a>
                </li>
                <li>
                <form action={`/api/threads/${thread.id}/delete`} method="post">
                    <input type="submit" value="Delete" />
                </form>
                </li>
            </>
            )}
        </menu>
        </footer>
    </article>
    );
};

export default Thread;
