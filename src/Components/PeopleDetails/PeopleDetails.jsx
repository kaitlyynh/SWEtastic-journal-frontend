import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import React from 'react';

function PeopleDetails() {
  const location = useLocation();
  // const navigate = useNavigate();
  // const { person: initialPerson } = location.state || {}; // get the passed person object
  const initialPerson = location?.state?.person || {}; 
  const [person, setPerson] = useState(initialPerson || {});
  const [newName, setNewName] = useState(person?.name || '');
  const [newAffiliation, setNewAffiliation] = useState(person?.affiliation || '');
  const [newRole, setNewRole] = useState(person?.role || '')
  const [roleOptions, setRoleOptions] = useState({})
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message


  const PERSON_EP = `${BACKEND_URL}/people/${initialPerson.email}`
  const UPDATE_NAME_EP =`${BACKEND_URL}/people/updateName/${person.email}/${newName}`
  const UPDATE_AFFIL_EP =`${BACKEND_URL}/people/updateAffiliation/${person.email}/${newAffiliation}`
  const UPDATE_ADD_ROLE_EP = `${BACKEND_URL}/people/${person.email}/addRole/${newRole}`
  const UPDATE_DELETE_ROLE_EP = `${BACKEND_URL}/people/${person.email}/removeRole/${newRole}`
  const ROLES_EP = `${BACKEND_URL}/roles`;
  
  useEffect(() => {
    if (!initialPerson?.email) return;

    axios.get(PERSON_EP)
      .then((response) => {
        setPerson(response.data);
        setNewName(response.data.name);
        setNewAffiliation(response.data.affiliation);
      })
      .catch((err) => setError(`Error fetching person details: ${err.message}`));

    axios
      .get(ROLES_EP)
      .then(({ data }) => {
        setRoleOptions(data);
      })
      .catch((err) => {
        setError(`Error fetching roles: ${err.message}`);
      });
    }, [initialPerson?.email]);

  if (!person) {
    return <div>No person data available.</div>;
  }
  
  const UpdateName = () => {
    axios
      .put(UPDATE_NAME_EP)
      .then(() => {
        setSuccessMessage('Name has been updated'); 
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 2000);
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
        setSuccessMessage('Affiliation has been updated'); 
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error. ${error}`);
        }
      });
    };

  const UpdateAddRole = () => {
    axios.put(UPDATE_ADD_ROLE_EP)
      .then(() => {
        setSuccessMessage('Role has been added'); 
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error with adding role. ${error}`);
        }
      });
    };
  
  const UpdateDeleteRole = () => {
    axios.delete(UPDATE_DELETE_ROLE_EP)
      .then(() => {
        setSuccessMessage('Role has been Deleted'); 
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError(`There was an unexpected error with removing role. ${error}`);
        }
      });
  };

  
  const handleRefreshPage = () => {
    // Reload the page
    window.location.reload();  
  };

  return (
    <div className="container mt-4 card shadow-sm p-4">
      <h1 className="mb-3 text-center mb-4">Person Details</h1>
      {/* Person's Current Info */}
      <p><strong>Email:</strong> {person.email}</p>
      <p><strong>Current Name:</strong> {person.name}</p>
      <p><strong>Current Affiliation:</strong> {person.affiliation}</p>
      <p><strong>Roles:</strong> {(person.roles || []).map(roleKey => roleOptions[roleKey] || roleKey).join(', ')}</p>
      <form>
        {/* Update Name */}
        <label className="form-label" htmlFor="name">Enter New Name</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          className="form-control"
          type="text"
          id="name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={UpdateName}>Update Name</button>
        </div>
        {/* Update Affiliation */}
        <label className="form-label" htmlFor="affiliation">Enter New Affiliation</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            className="form-control"
            type="text"
            id="affiliation"
            value={newAffiliation}
            onChange={(e) => setNewAffiliation(e.target.value)}
          />
          <button className="btn btn-primary" type="button" onClick={UpdateAffiliation}>Update Affiliation</button>
        </div>
      </form>
      {/* Update Role(s) */}
        <label htmlFor="role">Enter a Role:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              type="text"
              id="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              {Object.keys(roleOptions).map((code) => (
              <option key={code} value={code}>{roleOptions[code]}</option>
            ))}
            </select>
            <button className="btn btn-success" type="button" onClick={UpdateAddRole}>Add New Role</button>
            <button className="btn btn-danger" type="button" onClick={UpdateDeleteRole}>Delete Role</button>
        </div>
      {error && <p style= {{color:'red'}}>{error}</p>}
      
       {/* Display success message */}
       {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
      {/* Button to navigate back */}
      <button className="btn btn-secondary"type="button" onClick={handleRefreshPage} style={{ marginTop: '20px' }}>
        Refresh Page
      </button>

      {/* Button to return to /people */}
      <Link to="/people">
        <button className="btn btn-secondary" type="button" style={{ marginTop: '20px' }} >
          Return to People List
        </button>
      </Link>
      </div>
    </div>
  );
}

export default PeopleDetails;