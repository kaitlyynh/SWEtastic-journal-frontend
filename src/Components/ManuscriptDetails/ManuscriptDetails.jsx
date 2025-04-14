import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import React from 'react';

function ManuscriptDetails() {
  const location = useLocation();
  const initialManuscript = location?.state?.manuscript || {};
  const [manuscript, setManuscript] = useState(initialManuscript || {});
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [referees, setReferees] = useState('');
  const [error, setError] = useState('');
  const [isWithdrawn, setWithdrawn] = useState(false);

  const ManuscriptEP = `${BACKEND_URL}/manuscripts/${manuscript.title}`;


  useEffect(() => {
    if (!initialManuscript?.title) return;

    axios.get(ManuscriptEP)
      .then((response) => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setReferees(response.data.referees);
        setManuscript(response.data);
        setWithdrawn(response.data.curr_state == 'WIT');
        console.log(title);
      })
      .catch((err) => setError(`Error fetching manuscript details: ${err.message}`));
  }, [initialManuscript?.title]);

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

  return (
    <div className="container mt-4 card shadow-sm p-4">
        <h1 className="mb-3 text-center mb-4">
            Manuscript Details
        </h1>

      {error && <p className="alert alert-danger">{error}</p>}

      <p><strong>Title:</strong> {title}</p>
      <p><strong>Author:</strong> {author}</p>
      <p><strong>Referees:</strong> {referees}</p>
        <form>
            {!isWithdrawn ? (
                <button
                className="btn btn-primary"
                type="button"
                onClick={handleWithdraw}
                >
                Withdraw
                </button>
            ) : (
                <p className="alert alert-warning mt-3">
                This manuscript has been withdrawn.
                </p>
            )}
        </form>
    </div>
  );
}

export default ManuscriptDetails;
