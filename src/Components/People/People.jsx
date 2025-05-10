import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './People.css';

import { BACKEND_URL, EDITOR_ROLE } from '../../constants';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";


const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`;
const role = (localStorage.getItem("role") || "").toLowerCase();
const isEditor = role.toUpperCase() === EDITOR_ROLE;


function AddPersonForm({
  visible,
  cancel,
  fetchPeople,
  setError,
  roleOptions,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [roles, setRoles] = useState('');


  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeAffiliation = (event) => { setAffiliation(event.target.value); };
  const changeRoles = (event) => { setRoles(event.target.value); };

  const addPerson = (event) => {
    event.preventDefault();

    if (!roles) {
      setError("Please select a role before submitting.");
      return;
    }

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
      }
    })
      .then(() => {
        fetchPeople();
        window.location.reload();
      })
    
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error adding the person. ${error}`);
        }
      });
  };


  if (!visible) return null;
  return (
    <form className="container p-3 border rounded bg-light">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input required type="text" className="form-control" id="name" value={name} onChange={changeName} />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input required type="email" className="form-control" id="email" onChange={changeEmail} />
      </div>

      <div className="mb-3">
        <label htmlFor="affiliation" className="form-label">Affiliation</label>
        <input required type="text" className="form-control" id="affiliation" onChange={changeAffiliation} />
      </div>

      <div className="mb-3">
        <label htmlFor="roles" className="form-label">Roles</label>
        <select required className="form-select" name="role" value={roles} onChange={changeRoles}>
          <option value="" disabled>Select a Role</option>
          {Object.keys(roleOptions).map((code) => (
            <option key={code} value={code}>{roleOptions[code]}</option>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" onClick={addPerson}>Submit</button>
      </div>
    </form>

  );
}
AddPersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  roleOptions: propTypes.object.isRequired,
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

function Person({ person, fetchPeople, roleMap, }) {
  const [error, setError] = useState('');
  const { name, affiliation, email, roles } = person;

  const deletePerson = () => {
    axios
      .delete(`${PEOPLE_READ_ENDPOINT}/${email}`)
      .then(() => { fetchPeople() })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error deleting the person. ${error}`);
        }
      });
  };

  return (

    <div className="card my-3">
      <div className="card-body d-flex">
        <div className="me-3">
          <Link to={`/people/${name}`} state={{ person }} className="text-decoration-none text-dark">
            <h5 className="card-title">{name}</h5>
            <p className="card-text"><strong>Affiliation:</strong> {affiliation}</p>
            <p className="card-text"><strong>Email:</strong> {email}</p>
          </Link>
        </div>
        <div className="ms-3">
          <p className="card-text"><strong>Roles:</strong></p>
          <ul className="list-group">
            {roles.map((role) => (
              <li key={role} className="list-group-item">{roleMap[role]}</li>
            ))}
          </ul>
          <button className="btn btn-danger mt-2" onClick={deletePerson}>
            <FaTrashAlt />
            Delete Person
          </button>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>


  );
}
Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.arrayOf(propTypes.string).isRequired,
  }).isRequired,
  fetchPeople: propTypes.func.isRequired, // Added for deletion functionality
  roleMap: propTypes.object.isRequired,
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
  const [roleMap, setRoleMap] = useState({})

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => { setPeople(peopleObjectToArray(data)) })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error fetching the person. ${error}`);
        }
      });
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => {
        setRoleMap(data);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error adding the person. ${error}`);
        }
      });
  }


  const showAddPersonForm = () => { setAddingPerson(true); };
  const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);
  useEffect(getRoles, []);


  return (
    <div className="people-page">
      <header className="people-header">
        <h1>People Catalog</h1>
      </header>
      
      <div className="people-content">
        <div className="add-button-container">
        {role !== "au" && role !== "ad" && (
          <button className="btn btn-success d-flex align-items-center" onClick={showAddPersonForm}>
            <IoMdPersonAdd className="me-2" />
            Add a Person
          </button> )}
        </div>

        <AddPersonForm
          visible={addingPerson}
          cancel={hideAddPersonForm}
          fetchPeople={fetchPeople}
          setError={setError}
          roleOptions={roleMap}
        />

        {error && <ErrorMessage message={error} />}

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Affiliation</th>
              <th>Roles</th>
              {isEditor && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
  {people.map((person) => (
    <tr key={person.email}>
      <td>{person.name}</td>
      <td>{person.email}</td>
      <td>{person.affiliation}</td>
      <td>{person.roles.map((role) => roleMap[role]).join(', ')}</td>
      
      <td>
        {role !== "au" && role !== "ad" && (
          <>
            <button className="btn btn-sm btn-success me-2">
              <Link to={`/people/${person.name}`} state={{ person }}>
                <FaEdit color="white" />
              </Link>
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                axios
                  .delete(`${PEOPLE_READ_ENDPOINT}/${person.email}`)
                  .then(fetchPeople)
                  .catch((error) => {
                    if (error.response?.data?.message) {
                      setError(`Error: ${error.response.data.message}`);
                    } else {
                      setError(`There was an unexpected error deleting the person. ${error}`);
                    }
                  });
              }}
            >
              <FaTrashAlt />
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
      </div>
    </div>
  );
}

export default People;