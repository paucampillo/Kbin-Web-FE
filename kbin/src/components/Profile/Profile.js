import React, { useEffect, useState } from 'react';
import { getProfile } from '../../services/api';
import { useParams } from 'react-router-dom';
import "../../App.js"
  

  
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
    
    const avatarUrl = 'http://127.0.0.1:8000'+profile.profile.avatar; 
    const coverUrl = 'http://127.0.0.1:8000'+profile.profile.cover; 
    
    return (
      <div className="theme--dark" data-controller="kbin notifications" data-turbo="false">
      <main>
        <div id="middle" className="page-user page-user-overview">
          <div className="kbin-container">
            <main id="main" data-controller="lightbox timeago">
              <div className="section section--top">
                <div className="user-box">
                  <div className="with-cover with-avatar">
                    <img height="220" width="100%" className="cover" src={coverUrl} alt="Cover" />
                    <div className="user-main" id="content">
                      <div>
                        <div className="row">
                          <figure>
                            <img
                              width="100"
                              height="100"
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                              src={avatarUrl}
                              alt="Avatar"
                            />
                          </figure>
                          <h1>{profile.user.username}</h1>
                          <small>{profile.user.email}</small>
                          <small>{profile.profile.bio}</small>
                          <small>API-Key: Token {profile.key}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </main>
    </div>
    );
  };
  
  export default Profile;