import React from 'react';
import { boostThread, likeThread, dislikeThread } from '../../services/api';

const Thread = ({ thread, user }) => {

    if (!thread || !thread.id) {
        return null;
    }

    const handleBoost = async () => {
        try {
            await boostThread(thread.id);
            // Aquí puedes actualizar el estado o volver a obtener los datos si es necesario
            console.log('Thread boosted successfully');
            } catch (error) {
            console.error('Error boosting thread:', error);
            }
        };

    const handleLike = async () => {
        try {
            await likeThread(thread.id);
            // Aquí puedes actualizar el estado o volver a obtener los datos si es necesario
            console.log('Thread liked successfully');
        } catch (error) {
            console.error('Error liking thread:', error);
        }
        };
    
    const handleDislike = async () => {
        try {
            await dislikeThread(thread.id);
            // Aquí puedes actualizar el estado o volver a obtener los datos si es necesario
            console.log('Thread disliked successfully');
        } catch (error) {
            console.error('Error disliking thread:', error);
        }
    };

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
            {" "}to{" "}
            <a href={`/magazine/${thread.magazine.id}`} className="magazine-inline">
                {thread.magazine.name}
            </a>
        </aside>

        <aside className="vote">
            <button className="vote__up" onClick={handleLike} title="Favorite" aria-label="Favorite">
                <span>{thread.num_likes}</span>
                <span role="img" aria-label="thumbs up">👍</span>
            </button>
        
            <button className="vote__down" onClick={handleDislike} title="Reduce" aria-label="Reduce">
                <span>{thread.num_dislikes}</span>
                <span role="img" aria-label="thumbs down">👎</span>
            </button>
        </aside>

        <footer>
        <menu>
            <li>
            <a className="stretched-link" href={`/thread/${thread.id}#look-comments`}>
                <span>{thread.num_comments}</span> comments
            </a>
            </li>
            <li>
                <button onClick={handleBoost} className="boost-link stretched-link" type="button">
                    boost {thread.num_points > 0 && <span>({thread.num_points})</span>}
                </button>
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
