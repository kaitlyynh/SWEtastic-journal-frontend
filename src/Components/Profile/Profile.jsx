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
    <div className="profile-container">
      <div className="profile-card">
        <h2>Welcome, {username}!</h2>
        <p>This is your profile page.</p>
        {/* <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}

export default Profile;
