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
  const [error, setError] = useState('');

  if (!person) {
    return <div>No person data available.</div>;
  }

  const handleUpdate = () => {
    axios
      .put(`${BACKEND_URL}/people/updateName/${person.email}/${newName}`)
      .then(() => {
        navigate('/people'); // redirect after updating
      })
      .catch((err) => setError(`Error updating name: ${err.message}`));
  };

  return (
    <div>
      <h1>Person Details</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="button" onClick={handleUpdate}>Update</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default PeopleDetails;
