import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getUserInfo, getUserThreads, getUserBoosts, getUserComments, deleteComment, likeComment, getComment, unlikeComment, undislikeComment, dislikeComment } from '../../services/api'; // Ajusta la importación según tu estructura de archivos
import UserHeader from './UserHeader';
import OptionsMenu from './OptionsMenu';
import Menu from '../Threads/Menu';
import Filters from '../Threads/Filters';
import Thread from '../Threads/Thread';
import CommentBlock from '../Threads/CommentBlock';

const user = {
  id: 1,
  username: 'haonan',
  isAuthenticated: true,
};

const UserProfile = () => {
  const location = useLocation();
  const [profileUser, setProfileUser] = useState({});
  const [threads, setThreads] = useState([]);
  const [comments, setComments] = useState([]);
  const [boosts, setBoosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0); // Estado para almacenar el conteo total de comentarios y respuestas

  const { userId } = useParams(); // Asumiendo que estás usando un parámetro de ruta para userId
  const [order, setOrder] = useState('points'); // points, created_at, num_comments
  const [filter, setFilter] = useState('all');  // all, links, threads
  const [error, setError] = useState(null); // Estado para manejar errores
  const [orderBy, setOrderBy] = useState('likes'); // Estado para la opción de ordenación, por defecto 'likes'

  const isThreadsPage = location.pathname.includes('threads') || location.pathname === `/profile/${userId}`;
  const isBoostsPage = location.pathname.includes('boosts');
  const isCommentsPage = location.pathname.includes('comments');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileUserInfo = await getUserInfo(userId);
        setProfileUser(profileUserInfo);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const fetchThreads = useCallback(async () => {
    setError(null); // Resetea cualquier error previo
    try {
      const profileThreads = await getUserThreads(userId, filter, order);
      const profileBoosts = await getUserBoosts(userId);
      //const profileComments = await getUserComments(userId);

      const threadsWithTime = profileThreads.map(thread => ({
        ...thread,
        time_since_creation: timeElapsed(thread.created_at),
        time_since_update: timeElapsed(thread.updated_at),
        is_edited: isEdited(thread.created_at, thread.updated_at),
      }));

      setThreads(threadsWithTime);
      setBoosts(profileBoosts);
      //setComments(profileComments);
    } catch (error) {
      setError('Failed to fetch threads');
    }
  }, [filter, order, userId]);

  const handleOrderChange = (order) => {
    setOrderBy(order);
    fetchComments(order);
  };

  const handleDeleteComment = async (comment_id) => {
    try {
      await deleteComment(comment_id);
      console.log('Comment deleted successfully');
      fetchComments(orderBy);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  const handleLikeComment = async (comment_id) => {
    try {
        let commentData = await getComment(comment_id);
        if (commentData.user_has_liked) {
            await unlikeComment(comment_id);
            console.log('Comment unliked successfully');
        } else {
            await likeComment(comment_id);
            console.log('Comment liked successfully');
        }
        fetchComments(orderBy);
    } catch (error) {
        console.error('Error liking comment:', error);
    }
};

const handleDislikeComment = async (comment_id) => {
    try {
        const commentData = await getComment(comment_id);
        if (commentData.user_has_disliked) {
            await undislikeComment(comment_id);
            console.log('Comment undisliked successfully');
        } else {
            await dislikeComment(comment_id);
            console.log('Comment disliked successfully');
        }
        fetchComments(orderBy);
    } catch (error) {
        console.error('Error disliking comment:', error);
    }
};

  const fetchComments = useCallback(async (order) => {
    setError(null);

    try {
      const data = await getUserComments(userId, order);
      const commentsWithTime = data.map(comment => ({
        ...comment,
        time_since_creation: timeElapsed(comment.created_at),
        time_since_update: timeElapsed(comment.updated_at),
        is_edited: isEdited(comment.created_at, comment.updated_at),
        replies: comment.replies ? comment.replies.map(reply => ({
          ...reply,
          time_since_creation: timeElapsed(reply.created_at),
          time_since_update: timeElapsed(reply.updated_at),
          is_edited: isEdited(reply.created_at, reply.updated_at),
        })) : [],
      }));
      

      // Calcular el conteo total de comentarios y respuestas
      const totalCommentsCount = data.reduce((sum, comment) => {
        return sum + 1 + (comment.replies ? comment.replies.length : 0);
      }, 0);
      setCommentsCount(totalCommentsCount);
      setComments(commentsWithTime);
    } catch (error) {
      setError('Failed to fetch comments');
    }
  }, [orderBy]);

  useEffect(() => {
    fetchThreads();
    fetchComments(orderBy);
  }, [fetchThreads, fetchComments, orderBy]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  const isActive = (value, type) => {
    if (type === 'order' && order === value) {
      return 'active';
    }
    if (type === 'filter' && filter === value) {
      return 'active';
    }
    return '';
  };

  return (
    <div className="theme--dark" data-controller="kbin notifications" data-turbo="false">
      <main>
        <div id="middle" className="page-user page-user-overview">
          <div className="kbin-container">
            <main id="main" data-controller="lightbox timeago" className="">
              <UserHeader profileUser={profileUser} />
              <OptionsMenu profileUser={profileUser} threadsCount={threads.length} commentsCount={commentsCount} boostsCount={boosts.length} />
              {isThreadsPage && (
                <aside className="options options--top" id="options">
                  <Menu setOrder={setOrder} isActive={isActive} />
                  <Filters setFilter={setFilter} isActive={isActive} />
                </aside>
              )}
              <div id="content">
                {isThreadsPage && threads.map(thread => (
                  <Thread key={thread.id} thread={thread} user={user} reloadThreads={fetchThreads} />
                ))}
                {isBoostsPage && boosts.map(thread => (
                  <Thread key={thread.id} thread={thread} user={user} reloadThreads={fetchThreads} />
                ))}
                {isCommentsPage && (
                  <div id="content">
                    {comments && comments.length > 0 ? (
                      <section id="comments" className="comments entry-comments comments-tree" data-controller="" data-action="">
                        <aside className="options options--top" id="options">
                          <menu className="options__main no-scroll">
                            <li>
                              <a href="#likes" className={orderBy === 'likes' ? 'active' : ''} onClick={() => handleOrderChange('likes')}>top</a>
                            </li>
                            <li>
                              <a href="#newest" className={orderBy === 'newest' ? 'active' : ''} onClick={() => handleOrderChange('newest')}>newest</a>
                            </li>
                            <li>
                              <a href="#oldest" className={orderBy === 'oldest' ? 'active' : ''} onClick={() => handleOrderChange('oldest')}>oldest</a>
                            </li>
                          </menu>
                        </aside>
                        {comments.map(comment => (
                          <React.Fragment key={comment.id}>
                            <blockquote className="section comment entry-comment subject comment-level--1" id={`entry-comment-${comment.id}`} data-controller="comment subject mentions" data-subject-parent-value="" data-action="">
                              <header>
                              <a href={`/profile/${comment.author.id}/`} className="user-inline" title={comment.author.username}>
                                                {comment.author.username}
                                            </a>, <time className="timeago" title={comment.created_at} dateTime={comment.created_at}>{comment.time_since_creation}</time>
                                            {comment.is_edited && comment.created_at !== comment.updated_at && (
                                                <span className="edited">(edited <time className="timeago" title={comment.updated_at}>{comment.time_since_update} ago</time>)</span>
                                            )}


                                {comment.thread_id ? (
                                  <a href={`/thread/${comment.thread_id}`} className="magazine-inline">{" " + comment.thread_id + " "}</a>
                                ) : (
                                  'Unknown thread'
                                )}
                                in
                                {comment.magazine && comment.magazine.name ? (
                                  <a href={`/magazine/${comment.magazine.id}`} className="magazine-inline">{" " + comment.magazine.name}</a>
                                ) : (
                                  'Unknown magazine'
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
                                            <button className="vote__up" onClick={() => handleLikeComment(comment.id)} title="Favorite" aria-label="Favorite">
                                                <span style={{ color: comment.user_has_liked ? '#13F30B' : 'inherit' }}>{comment.num_likes}</span>
                                                <span role="img" aria-label="thumbs up">👍</span>
                                            </button>

                                            <button className="vote__down" onClick={() => handleDislikeComment(comment.id)} title="Reduce" aria-label="Reduce">
                                                <span style={{ color: comment.user_has_disliked ? '#F30B0B' : 'inherit' }}>{comment.num_dislikes}</span>
                                                <span role="img" aria-label="thumbs down">👎</span>
                                            </button>
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
                                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                      </li>
                                    </>
                                  )}
                                </menu>
                              </footer>
                            </blockquote>
                            {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                                        <CommentBlock key={reply.id} comment={reply} level={reply.reply_level + 1} user={user} parentReply={reply.parent_reply_id} profileView={false} fetchComments={fetchComments}/>
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
                )}
              </div>
            </main>
          </div>
        </div>
        <footer id="footer"></footer>
      </main>
      <footer>{/* Optional footer content */}</footer>
    </div>
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

export default UserProfile;
