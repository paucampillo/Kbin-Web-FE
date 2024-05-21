import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../services/api';

const EditProfile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', profile: { bio: '' } });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateProfile(profile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={profile.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <textarea
        name="profile.bio"
        value={profile.profile.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfile;
