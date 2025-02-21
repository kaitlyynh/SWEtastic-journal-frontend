import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';


const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;


function AddPersonForm({
  visible,
  cancel,
  fetchPeople,
  setError,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [roles, setRoles] = useState([]);


  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeAffiliation = (event) => { setAffiliation(event.target.value); };
  const changeRoles = (event) => { setRoles(event.target.value); };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      email: email,
      affiliation: affiliation,
      roles: roles 
    }
    axios.put(PEOPLE_CREATE_ENDPOINT, newPerson, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      } })
      .then(fetchPeople)
      .catch((error) => { setError(`There was a problem adding the person. ${error}`); });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />
      <label htmlFor="email">
        Email
      </label>
      <input required type="text" id="email" onChange={changeEmail} />
      <label htmlFor="affiliation">
        Affiliation
      </label>
      <input required type="text" id="affiliation" onChange={changeAffiliation} />
      <label htmlFor="roles">
        Roles
      </label> <br/> <br/>
        <select id="roles" multiple onChange={changeRoles}>
          <option value="AU">AU</option>
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
          {/* Add more role options as needed */}
        </select>
      <div>
        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit" onClick={addPerson}>Submit</button>
      </div>
      
    </form>
  );
}
AddPersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Person({ person, updatePersonName }) {
  console.log('Person object:', person);
  const { name, affiliation, email, roles } = person;
  const [newName, setNewName] = useState(name);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleUpdate = () => updatePersonName(email, newName);

  return (
    <div>
    <Link to={name}>
      <div className="person-container">
        <h2>{name}</h2>
        <p> Affiliation: {affiliation}</p>
        <p>
          Email: {email}
        </p>
        <p>Roles: {roles}</p>
      </div>
    </Link>
     <input
     type="text"
     value={newName}
     onChange={handleNameChange}
     placeholder="Enter new name"
   />
   <button onClick={handleUpdate}>Update Name</button>
 </div>
  );
}
Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.oneOfType([propTypes.string, propTypes.array])
  }).isRequired,
  updatePersonName: propTypes.func.isRequired,
};

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data);
  const people = keys.map((key) => Data[key]);
  return people;
}

function People() {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  const [addingPerson, setAddingPerson] = useState(false);

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => { setPeople(peopleObjectToArray(data)) })
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  const updatePersonName = (email, newName) => {
    axios.put(`${BACKEND_URL}/people/updateName/${email}/${newName}`)
      .then(response => {
        console.log('Update response:', response.data);
  
        // update the local state
        setPeople(prevPeople => prevPeople.map(person =>
          person.email === email ? { ...person, name: newName } : person
        ));
  
        // fetch the latest list from the backend to ensure accuracy, bc would update wrong one
        fetchPeople();
      })
      .catch(error => {
        console.error('Error updating person:', error.response || error);
        setError(`There was a problem updating the person: ${error}`);
      });
  };
  
  const showAddPersonForm = () => { setAddingPerson(true); };
  const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);

  return (
    <div className="wrapper">
      <header>
        <h1>
          View All People
        </h1>
        <button type="button" onClick={showAddPersonForm}>
          Add a Person
        </button>
      </header>
      <AddPersonForm
        visible={addingPerson}
        cancel={hideAddPersonForm}
        fetchPeople={fetchPeople}
        setError={setError}
      />
      {error && <ErrorMessage message={error} />}
      {people.map((person) => (
        <Person
          key={person.name}
          person={person}
          updatePersonName={updatePersonName} // Pass the function as a prop
  />
))}
    </div>
  );
}

export default People;
