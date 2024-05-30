import React from 'react';
import { boostThread, unboostThread, likeThread, unlikeThread, dislikeThread, undislikeThread, deleteThread } from '../../services/api';

const Thread = ({ thread, user, reloadThreads, showBody = false, onDelete }) => {

    const handleBoost = async () => {
        try {
            await boostThread(thread.id);
            console.log('Thread boosted successfully');
            reloadThreads(); // Recargar threads después de boost
        } catch (error) {
            if (error.message === "The user has already boosted this thread") {
                try {
                    await unboostThread(thread.id);
                    console.log('Thread unboosted successfully');
                    reloadThreads(); // Recargar threads después de unboost
                } catch (unboostError) {
                    console.error('Error unboosting thread:', unboostError);
                }
            } else {
                console.error('Error boosting thread:', error);
            }
        }
    };

    const handleLike = async () => {
        try {
            if (thread.user_has_liked) {
                await unlikeThread(thread.id);
                console.log('Thread unliked successfully');
            } else {
                await likeThread(thread.id);
                console.log('Thread liked successfully');
            }
            reloadThreads(); // Recargar threads después de like/unlike
        } catch (error) {
            console.error('Error handling like/unlike:', error);
        }
    };

    const handleDislike = async () => {
        try {
            if (thread.user_has_disliked) {
                await undislikeThread(thread.id);
                console.log('Thread undisliked successfully');
            } else {
                await dislikeThread(thread.id);
                console.log('Thread disliked successfully');
            }
            reloadThreads(); // Recargar threads después de dislike/undislike
        } catch (error) {
            console.error('Error disliking thread:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteThread(thread.id);
            console.log('Thread deleted successfully');
            reloadThreads();
            onDelete();
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
    };

    return (
        <article className="entry section subject no-image entry--single section--top">
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

            {showBody && (
                <div className="entry__body">
                    <div className="content formatted" style={{}}>
                        <p>{thread.body}</p>
                    </div>
                </div>
            )}

            <aside className="meta entry__meta">
                <a href={`/profile/${thread.author.id}`} className="user-inline">
                    {thread.author.username}
                </a>
                ,
                <time className="timeago" title={thread.created_at}>
                    {" "}{thread.time_since_creation}
                </time>
                {thread.is_edited && (
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
                    <span style={{ color: thread.user_has_liked ? '#13F30B' : 'inherit' }}>{thread.num_likes}</span>
                    <span role="img" aria-label="thumbs up">👍</span>
                </button>

                <button className="vote__down" onClick={handleDislike} title="Reduce" aria-label="Reduce">
                    <span style={{ color: thread.user_has_disliked ? '#F30B0B' : 'inherit' }}>{thread.num_dislikes}</span>
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
                                <button onClick={handleDelete} className="delete-button" type="button">
                                    Delete
                                </button>
                            </li>
                        </>
                    )}
                </menu>
            </footer>
        </article>
    );
};

export default Thread;