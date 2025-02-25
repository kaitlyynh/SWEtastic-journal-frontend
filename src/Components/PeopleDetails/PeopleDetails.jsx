import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;

const PersonDetails = () => {
  const { email } = useParams();  // extract email from URL
  console.log('Email from URL:', email); 
  const [person, setPerson] = useState(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPerson = () => {
    console.log('Fetching person with email:', email);  // log email to check it's correct
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => {
        console.log('Fetched data:', data);  
        // convert the object to an array and find the person with the matching email
        const personFound = Object.values(data).find(person => person.email === email);
        
        if (personFound) {
          setPerson(personFound);
          setNewName(personFound.name || ''); 
        } else {
          setError('Person not found.');
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);  
        setError(`There was a problem retrieving the person's details. ${error}`);
      });
  };

  const handleUpdate = () => {
    if (person && person.email) {
      axios.put(`${BACKEND_URL}/people/updateName/${person.email}/${newName}`)
        .then(() => navigate(`/people`))  // redirect to people page for now 
        
        .catch(err => setError(`Error updating name: ${err}`));
    } else {
      setError('Email is missing for this person.');
    }
  };

  useEffect(() => {
    if (email) fetchPerson();  // only fetch if there's an email in the params
  }, [email]);

  if (!person) {
    return <div>Loading person details...</div>;
  }

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
};

export default PersonDetails;
