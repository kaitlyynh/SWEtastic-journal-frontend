import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import React from 'react';


function PeopleDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { person: initialPerson } = location.state || {}; // get the passed person object

  const [person, setPerson] = useState(initialPerson);
  const [newName, setNewName] = useState(person?.name || '');
  const [newAffiliation, setNewAffiliation] = useState(person?.affiliation || '');
  const [newRole, setNewRole] = useState(person?.role || '')
  const [error, setError] = useState('');

  const PERSON_EP = `${BACKEND_URL}/people/${initialPerson.email}`
  const UPDATE_NAME_EP =`${BACKEND_URL}/people/updateName/${person.email}/${newName}`
  const UPDATE_AFFIL_EP =`${BACKEND_URL}/people/updateAffiliation/${person.email}/${newAffiliation}`
  const UPDATE_ROLE_EP = `${BACKEND_URL}/people/${person.email}/addRole/${newRole}`
  // @api.route(f'{PEOPLE_EP}/<string:email>/addRole/<string:role>')
  useEffect(() => {
    if (!initialPerson?.email) return;

    axios.get(PERSON_EP)
      .then((response) => {
        setPerson(response.data);
        setNewName(response.data.name);
        setNewAffiliation(response.data.affiliation);
      })
      .catch((err) => setError(`Error fetching person details: ${err.message}`));
  }, [initialPerson?.email]);

  if (!person) {
    return <div>No person data available.</div>;
  }
  
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

    const UpdateRole = () => {
      axios
        .put(UPDATE_ROLE_EP)
        .then(() => {
          navigate('/people'); // redirect after updating
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            setError(`Error: ${error.response.data.message}`);
          } else {
            setError(`There was an unexpected error with updating role. ${error}`);
          }
        });
      };

  return (
    <div>
      <h1>Person Details</h1>

      {/* Person's Current Info */}
      <p><strong>Email:</strong> {person.email}</p>
      <p><strong>Current Name:</strong> {person.name}</p>
      <p><strong>Current Affiliation:</strong> {person.affiliation}</p>
      <p><strong>Roles:</strong> {person.roles.join(', ')}</p>
      
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
        {/* Update Affiliation */}
      </form>
      {/* Update Role(s) */}
      <label htmlFor="role">Enter new Role:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            id="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <button type="button" onClick={UpdateRole}>Update Role</button>
        </div>
      {error && <p style= {{color:'red'}}>{error}</p>}
    </div>
  );
}

export default PeopleDetails;
