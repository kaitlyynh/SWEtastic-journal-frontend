import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import React from 'react';

function ManuscriptDetails() {
  const location = useLocation();
  // const initialPerson = location?.state?.person || {};
  const initialManuscript = location?.state?.manuscript || {};
  const [manuscript, setManuscript] = useState(initialManuscript || {});
  const [title, setTitle] = useState('');
  const [refereeList, setRefereeList] = useState([]);
  const [assignedReferees, setAssignedReferees] = useState({});
  const [error, setError] = useState('');
  const [validActions, setValidActions] = useState([])
  const [allValidActions, setAllValidActions] = useState([]);
  const [allValidStates, setAllValidStates] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedReferee, setSelectedReferee] = useState('');



  const ManuscriptEP = `${BACKEND_URL}/manuscripts/${manuscript.title}`;
  const RefEP = `${BACKEND_URL}/roles/RE`;
  const AllActionsEP = `${BACKEND_URL}/manuscripts/ValidActions`;
  const ActEP = `${BACKEND_URL}/manuscripts/ValidActions/${manuscript.curr_state}`;
  const AllStatesEP = `${BACKEND_URL}/manuscripts/ValidStates`;
  const receiveActionEP = `${BACKEND_URL}/manuscripts/receive_action`;

  // const PERSON_EP = `${BACKEND_URL}/people/${initialPerson.email}`


  useEffect(() => {
    if (!initialManuscript?.title) return;

    axios.get(ManuscriptEP)
      .then((response) => {
        const data = response.data;
        setTitle(data.title);
        setManuscript(data);
        setAssignedReferees(Array.isArray(data.referees) ? data.referees : []);
        console.log(title);
        return axios.get(ActEP);
      })
      .then(({ data }) => {
        setValidActions(data);
        console.log("Valid Actions based on state:", data);
      })
      .catch((err) => setError(`Error fetching manuscript details: ${err.message}`));

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
        return axios.get(`${BACKEND_URL}/manuscripts/ValidActions/${data.curr_state}`);
      })
      .then(({ data }) => {
        setValidActions(data);
      })
      .catch(err => setError(`Failed to refresh manuscript data: ${err.message}`));
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

  const handleActionSubmit = (response) => {
    response.preventDefault();
    const payload = {
      title,
      action: selectedAction,
    };

    if (selectedAction === 'ARF' || selectedAction === 'DRF') {
      payload.referee = selectedReferee;
    }

    axios.put(receiveActionEP, payload, {
      headers: {
        'Content-Type': 'application/json',
        // 'Accept': 'application/json',
      }
    })

      .then((response) => {
        console.log('Action submitted successfully:', response.data);
        setSelectedAction('');
        setSelectedReferee('');
        refreshManuscriptData();
      })
      .catch((err) => {
        console.error(err);
        setError(`Failed to submit action: ${err.message}`);
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
      {validActions.length > 0 && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h5>📘 Action Workflow</h5>
          <p><strong>Current State:</strong> {allValidStates[manuscript.curr_state] || manuscript.curr_state}</p>
          <p><strong>Available Actions:</strong></p>
          <ul className="mb-0">
            {validActions.map((actionCode, index) => (
              <li key={index}>
                <strong>{allValidActions[actionCode] || actionCode}</strong>
              </li>
          ))}
        </ul>
      </div>
)}


      {/* Display current assigned referees */}
      <div className="mt-4">
        <h4>Assigned Referees:</h4>
        {assignedReferees.length > 0 ? (
          <ul>
            {assignedReferees.map((email, index) => (
              <li key={index}>
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No referees assigned yet.</p>
        )}
      </div>


      {/* Dropdown to select an action */}
      <div className="form-group mt-4">
        <label><strong>Valid Actions:</strong></label>
        <select
          className="form-select"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}

        >
          <option value="" disabled>Select an Action</option>
          {validActions.map((code) => (
            <option key={code} value={code}>
              {allValidActions[code] || code}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown to select a new referee */}
      {(selectedAction === 'ARF' || selectedAction === 'DRF') && (
        <div className="form-group mt-4">
          <label><strong>Select Referee:</strong></label>
          <select
            className="form-select"
            value={selectedReferee}
            onChange={(e) => setSelectedReferee(e.target.value)}
          >
            <option value="" disabled>Select a Referee</option>
            {refereeList.map((email, index) => (
              <option key={index} value={email}>{email}</option>
            ))}
          </select>
        </div>
      )}
      {/* Submit button */}
      <div className="form-group mt-4">
        <button
          className="btn btn-success"
          type="button"
          onClick={handleActionSubmit}
          disabled={!selectedAction || ((selectedAction === 'ARF' || selectedAction === 'DRF') && !selectedReferee)}
        >
          Submit Action
        </button>
      </div>

      {/* Buttons */}
      <div className="d-flex flex-wrap gap-2 mt-4">
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