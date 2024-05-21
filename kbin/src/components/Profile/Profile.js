import React, { useEffect, useState } from 'react';
import { getProfile } from '../../services/api';
import { useParams } from 'react-router-dom';
  
  const Profile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const data = await getProfile(userId);
          setProfile(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProfile();
    }, [userId]);
  
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;
  
    return (
      <div>
        <h1>{profile.user.username}'s Profile</h1>
        <h2>Profile Details</h2>
        <div>Bio: {profile.profile.bio}</div>
        <div>Avatar: <img src={profile.profile.avatar} alt="Avatar" /></div>
        <div>Cover: <img src={profile.profile.cover} alt="Cover" /></div>
  
        <h2>Threads</h2>
        <ul>
          {profile.threads.map(thread => (
            <li key={thread.id}>
              <h3>{thread.title}</h3>
              <div>URL: {thread.url}</div>
              <div>Body: {thread.body}</div>
              <div>Created At: {thread.created_at}</div>
              <div>Updated At: {thread.updated_at}</div>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
  
        <h2>Comments</h2>
        <ul>
          {profile.comments.map(comment => (
            <li key={comment.id}>
              <div>Body: {comment.body}</div>
              <div>Created At: {comment.created_at}</div>
              <div>Updated At: {comment.updated_at}</div>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
  
        <h2>Boosts</h2>
        <ul>
          {profile.boosts.map(boost => (
            <li key={boost.id}>
              <h3>{boost.title}</h3>
              <div>URL: {boost.url}</div>
              <div>Body: {boost.body}</div>
              <div>Created At: {boost.created_at}</div>
              <div>Updated At: {boost.updated_at}</div>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
  
        {/* Add more sections as needed */}
      </div>
    );
  };
  
  export default Profile;