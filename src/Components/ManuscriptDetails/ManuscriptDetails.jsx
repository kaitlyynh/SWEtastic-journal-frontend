import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import React from 'react';

function ManuscriptDetails() {
  const location = useLocation();
  // const initialPerson = location?.state?.person || {};
  const initialManuscript = location?.state?.manuscript || {};
  // const [person, setPerson] = useState(initialPerson || {});
  const [manuscript, setManuscript] = useState(initialManuscript || {});
  const [title, setTitle] = useState('');
  // const [author, setAuthor] = useState('');
  const [refereeList, setRefereeList] = useState([]);
  const [assignedReferees, setAssignedReferees] = useState({});
  const [error, setError] = useState('');
  const [isWithdrawn, setWithdrawn] = useState(false);
  const [validActions, setValidActions] = useState([])
  const [allValidActions, setAllValidActions] = useState([]);
  const [allValidStates, setAllValidStates] = useState([]);


  const ManuscriptEP = `${BACKEND_URL}/manuscripts/${manuscript.title}`;
  const RefEP = `${BACKEND_URL}/roles/RE`;
  const AllActionsEP = `${BACKEND_URL}/manuscripts/ValidActions`;
  const ActEP = `${BACKEND_URL}/manuscripts/ValidActions/${manuscript.curr_state}`;
  const AllStatesEP = `${BACKEND_URL}/manuscripts/ValidStates`;

  // const PERSON_EP = `${BACKEND_URL}/people/${initialPerson.email}`


  useEffect(() => {
    if (!initialManuscript?.title) return;

    axios.get(ManuscriptEP)
      .then((response) => {
        const data = response.data;
        setTitle(data.title);
        setManuscript(data);
        setAssignedReferees(Array.isArray(data.referees) ? data.referees : []);
        setWithdrawn(data.curr_state === 'WIT');
        console.log(title);
      })
      .catch((err) => setError(`Error fetching manuscript details: ${err.message}`));


    axios
      .get(ActEP)
      .then(({ data }) => {
        setValidActions(data);
        console.log("Valid Actions:", data);
      })
      .catch((err) => {
        setError(`Error fetching actions: ${err.message}`);
      });


    axios.get(RefEP)
      .then((response) => {
        console.log("Referees emails:", response.data);
        setRefereeList(response.data);
      })
      .catch((err) => {
        setError(`Error fetching referees: ${err.message}`);
      });

    axios
      .get(AllStatesEP)
      .then(({ data }) => {
        setAllValidStates(data);
      })
      .catch((err) => {
        setError(`Error fetching states: ${err.message}`);
      });

    axios
      .get(AllActionsEP)
      .then(({ data }) => {
        setAllValidActions(data);
      })
      .catch((err) => {
        setError(`Error fetching actions: ${err.message}`);
      });

  }, [initialManuscript?.title]);


  const refreshManuscriptData = () => {
    axios.get(`${BACKEND_URL}/manuscripts/${encodeURIComponent(manuscript.title)}`)
      .then((response) => {
        const data = response.data;
        setManuscript(data);
        setAssignedReferees(data.referees || []);
      })
      .catch(err => setError(`Failed to refresh manuscript data: ${err.message}`));
  };

  // Function to handle adding a referee to the assigned list
  //   const handleAddReferee = (email) => {
  //     if (!assignedReferees.includes(email)) {
  //       setAssignedReferees([...assignedReferees, email]);
  //       console.log(assignedReferees);
  //     }
  //   };
  // handleAddReferee using new endpoint
  const handleAddReferee = (email) => {
    if (!assignedReferees.includes(email)) {
      axios.put(`${BACKEND_URL}/manuscripts/${encodeURIComponent(manuscript.title)}/add_referee`, {
        referee: email
      })
        .then((response) => {
          refreshManuscriptData(); // re-sync with backend
          console.log(response.data.manuscript)
        })
        .catch((err) => {
          setError(`Failed to add referee: ${err.message}`);
        });
    }
  };

  // Function to delete a referee from the assigned list
  const handleRemoveReferee = (email) => {
    axios.put(`${BACKEND_URL}/manuscripts/${encodeURIComponent(manuscript.title)}/delete_referee`, {
      referee: email
    })
      .then(() => {
        refreshManuscriptData(); // refresh to show updated list from backend
      })
      .catch((err) => {
        setError(`Failed to delete referee: ${err.message}`);
      });
  };


  const handleWithdraw = () => {
    axios.put(`${BACKEND_URL}/manuscripts/${manuscript.title}/update/WIT`)
      .then(() => {
        setWithdrawn(true);
      })
      .catch(err => {
        console.log(err)
        setError(`Failed to withdraw manuscript: ${err.message}`);
      });
  };

  const handleDelete = () => {
    axios.delete(`${BACKEND_URL}/manuscripts/${encodeURIComponent(manuscript.title)}/delete`)
      .then(() => {
        alert("Successfully deleted manuscript");
        window.location.reload()
      })
      .catch(err => {
        console.log(err);
        setError(`Failed to delete manuscript: ${err.message}`);
      });
  };


  return (
    <div className="container mt-4 card shadow-sm p-4">
      <h1 className="mb-3 text-center mb-4">
        Manuscript Details
      </h1>

      {error && <p className="alert alert-danger">{error}</p>}

      <p><strong>Title:</strong> {manuscript.title}</p>
      <p><strong>Author:</strong> {manuscript.author}</p>
      <p><strong>Email:</strong> {manuscript.author_email}</p>
      <p><strong>Abstract:</strong> {manuscript.abstract}</p>
      <p><strong>Text:</strong> {manuscript.text}</p>
      <p><strong>Status:</strong> {allValidStates[manuscript.curr_state] || manuscript.curr_state}</p>

      {/* Display current assigned referees */}
      <div className="mt-4">
        <h4>Assigned Referees:</h4>
        {assignedReferees.length > 0 ? (
          <ul>
            {assignedReferees.map((email, index) => (
              <li key={index}>
                {email}
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleRemoveReferee(email)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No referees assigned yet.</p>
        )}
      </div>

      {/* Dropdown to select a new referee */}
      <div className="form-group mt-4">
        <label><strong>Select Referee to Add:</strong></label>
        <select
          className="form-select"
          onChange={(e) => handleAddReferee(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a Referee</option>
          {refereeList.map((email, index) => (
            <option key={index} value={email}>{email}</option>
          ))}
        </select>
      </div>

      {/* Dropdown to select an action */}
      <div className="form-group mt-4">
        <label><strong>Valid Actions:</strong></label>
        <select
          className="form-select"
          defaultValue=""
          onChange={(e) => console.log("Selected action:", e.target.value)}
        >
          <option value="" disabled>Select an Action</option>
          {Object.keys(validActions).map((code) => (
            <option key={code} value={code}>
              {allValidActions[validActions[code]] || validActions[code]} 
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="d-flex flex-wrap gap-2 mt-4">
        <form>
          {!isWithdrawn ? (
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleWithdraw}
              style={{ marginTop: '20px' }}
            >
              Withdraw
            </button>
          ) : (
            <p className="alert alert-warning mt-3">
              This manuscript has been withdrawn.
            </p>
          )}
        </form>
        <form>
          <Link to="/manuscripts">
            <button
              className="btn btn-sm btn-danger"
              onClick={handleDelete}
              style={{ marginTop: '20px' }}
            > Delete
            </button>
          </Link>
        </form>
        {/* Button to return to /manuscripts*/}
        <Link to="/manuscripts">
          <button className="btn btn-secondary" type="button" style={{ marginTop: '20px' }} >
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ManuscriptDetails;