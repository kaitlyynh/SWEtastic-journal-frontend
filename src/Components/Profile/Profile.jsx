// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const loggedIn = localStorage.getItem('loggedIn');

    if (!loggedIn) {
      navigate('/login');
    } else {
      setUsername(storedName || 'Guest');
    }
  }, [navigate]);

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Welcome, {username}!</h1>
      </header>
      <div className="profile-content">
        <p>This is your profile page.</p>
        {/* Add your profile content here */}
      </div>
    </div>
  );
}

export default Profile;
