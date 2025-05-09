import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Profile.css';

function Profile() {
  const [name, setName] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [affiliation, setAffiliation] = useState('');
  const [role] = useState(localStorage.getItem('role') || 'Not assigned');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    axios.get(`${BACKEND_URL}/people`)
      .then(({ data }) => {
        const person = Object.values(data).find(p => p.email === email);
        if (person) {
          setAffiliation(person.affiliation || '');
          setEmail(person.email);
        } else {
          setMessage("Could not find your profile in the people database.");
        }
      })
      .catch(err => {
        console.error(err);
        setMessage("Error loading profile.");
      })
      .finally(() => setLoading(false));
  }, [email, navigate]);

  const handleSave = async () => {
    try {
      const encodedName = encodeURIComponent(name);
      const encodedAffiliation = encodeURIComponent(affiliation);

      await axios.put(`${BACKEND_URL}/people/updateName/${email}/${encodedName}`);
      await axios.put(`${BACKEND_URL}/people/updateAffiliation/${email}/${encodedAffiliation}`);

      localStorage.setItem('username', name);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Welcome, {name || "Guest"}!</h1>
      </header>
      <div className="profile-content">
        {loading ? <p>Loading...</p> : (
          <div className="profile-section">
            <h2>Your Information</h2>
            <div className="profile-info">
              <div className="mb-3">
                <label className="form-label"><strong>Name:</strong></label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <p><strong>Email:</strong> {email}</p>
              <p><strong>Role:</strong> {role}</p>

              <div className="mb-3">
                <label className="form-label"><strong>Affiliation:</strong></label>
                <input
                  className="form-control"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                />
              </div>

              <button className="btn btn-primary mt-2" onClick={handleSave}>Save Changes</button>
              {message && <p className="mt-2 text-info">{message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
