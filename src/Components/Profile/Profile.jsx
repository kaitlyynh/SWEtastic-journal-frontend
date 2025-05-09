// src/Components/Profile/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Profile.css';

function Profile() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const loggedIn = localStorage.getItem('loggedIn');
    const email = localStorage.getItem('email');
    

    if (!loggedIn) {
      navigate('/login');
      return;
    }
    
    setUsername(storedName || 'Guest');
    
    // If email is missing, try to fetch all people and find by username
    if (!email && storedName) {
      setLoading(true);
      axios.get(`${BACKEND_URL}/people`)
        .then(({ data }) => {
          // Try to find the user by name (not ideal but a fallback)
          const user = Object.values(data).find(person => 
            person.name && person.name.toLowerCase() === storedName.toLowerCase()
          );
          
          if (user) {
            setUserData(user);
            // Store the email for future use
            if (user.email) {
              localStorage.setItem('email', user.email);

            }
          } else {
            setError('Could not find your profile. Please log out and log in again.');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError('Error loading user data: ' + err.message);
          setLoading(false);
        });
    } else if (email) {
      // Original flow - fetch by email
      setLoading(true);
      axios.get(`${BACKEND_URL}/people`)
        .then(({ data }) => {
          // Find the user with matching email
          const user = Object.values(data).find(person => 
            person.email && person.email.toLowerCase() === email.toLowerCase()
          );
          
          if (user) {
            setUserData(user);
          } else {
            setError('Your user profile was not found in the system.');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError('Error loading user data: ' + err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('No user information found. Please log out and log in again.');
    }
  }, [navigate]);

  // Format roles for display
  // const formatRoles = (roles) => {
  //   if (!roles || roles.length === 0) return 'No roles assigned';
    
  //   return roles.map((role, index) => (
  //     <span key={index} className="role-badge">
  //       {role}
  //     </span>
  //   ));
  // };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Welcome, {username}!</h1>
      </header>
      <div className="profile-content">
        {error && <p className="text-danger">{error}</p>}
        
        {loading ? (
          <p>Loading your profile information...</p>
        ) : (
          <>
            <div className="profile-section">
              <h2>Your Information</h2>
              <div className="profile-info">
                <p><strong>Email:</strong> {userData?.email || localStorage.getItem('email') || 'Not available'}</p>
                
                {/* <div className="profile-roles">
                  <h3>Your Roles</h3>
                  <div className="roles-container">
                    {userData && userData.roles ? 
                      formatRoles(userData.roles) : 
                      'No roles assigned'}
                  </div>
                </div> */}
                <p><strong>Role:</strong> {localStorage.getItem('role') || 'Not assigned'}</p>

                
                <div className="profile-affiliation">
                  <h3>Affiliation</h3>
                  <p>{userData && userData.affiliation ? 
                    userData.affiliation : 
                    'No affiliation specified'}</p>
                </div>
              </div>
            </div>
            
            {/* Add a manual email entry option */}
            {!userData && (
              <div className="profile-section">
                <h2>Update Your Profile</h2>
                <p>Your email is missing. Please enter it below to retrieve your profile:</p>
                <div className="email-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="form-control"
                    onChange={(e) => {
                      if (e.target.value) {
                        localStorage.setItem('email', e.target.value);
                      }
                    }}
                  />
                  <button 
                    className="btn btn-primary mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
