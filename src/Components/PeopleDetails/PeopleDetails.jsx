import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import React from 'react';


function PeopleDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { person } = location.state || {}; // get the passed person object

  const [newName, setNewName] = useState(person?.name || '');
  const [newAffiliation, setNewAffiliation] = useState(person?.affiliation || '');
  const [error, setError] = useState('');

  if (!person) {
    return <div>No person data available.</div>;
  }

  const UPDATE_NAME_EP =`${BACKEND_URL}/people/updateName/${person.email}/${newName}`
  const UPDATE_AFFIL_EP =`${BACKEND_URL}/people/updateAffiliation/${person.email}/${newAffiliation}`
  
  const UpdateName = () => {
    axios
      .put(UPDATE_NAME_EP)
      .then(() => {
        navigate('/people'); // redirect after updating
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error. ${error}`);
        }
      });
    };

  const UpdateAffiliation = () => {
    axios
      .put(UPDATE_AFFIL_EP)
      .then(() => {
        navigate('/people'); // redirect after updating
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error. ${error}`);
        }
      });
    };

  return (
    <div>
      <h1>Person Details</h1>
      <form>
        {/* Update Name */}
        <label htmlFor="name">Enter New Name:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          id="name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="button" onClick={UpdateName}>Update Name</button>
      </div>
      {/* Update Affiliation */}
      <label htmlFor="name">Enter New Name:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          id="affiliation"
          value={newAffiliation}
          onChange={(e) => setNewAffiliation(e.target.value)}
        />
        <button type="button" onClick={UpdateAffiliation}>Update Affiliation</button>
      </div>
      </form>
      {error && <p style= {{color:'red'}}>{error}</p>}
    </div>
  );
}

export default PeopleDetails;
