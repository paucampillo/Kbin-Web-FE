import React from 'react';

const UserHeader = ({ profileUser }) => {
  if (!profileUser || !profileUser.user) {
    return <div>Loading...dddddddddd</div>; // O algún tipo de indicador de carga
  }

  return (
    <div className="section section--top">
      <div className="user-box">
        <div className="with-cover with-avatar">
          <img
            height="220"
            width="100%"
            className="cover"
            src={profileUser.cover}
            alt={`@${profileUser.user.username}`}
          />
          <div className="user-main" id="content">
            <div>
              <div className="row">
                <figure>
                  <img
                    width="100"
                    height="100"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                    src={profileUser.avatar}
                    alt={`@${profileUser.user.username} avatar`}
                  />
                </figure>
                <h1>{profileUser.user.username}</h1>
                <small>{profileUser.user.email}</small>
                <small>{profileUser.bio}</small>
                <small>API-Key: Token {profileUser.key}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
