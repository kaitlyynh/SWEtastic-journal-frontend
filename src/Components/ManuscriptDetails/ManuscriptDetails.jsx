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

  const ManuscriptEP = `${BACKEND_URL}/manuscripts/${manuscript.title}`;

  useEffect(() => {
    if (!initialManuscript?.title) return;

    axios.get(ManuscriptEP)
      .then((response) => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setReferees(response.data.referees);
        setManuscript(response.data);
        console.log(title);
      })
      .catch((err) => setError(`Error fetching manuscript details: ${err.message}`));
  }, [initialManuscript?.title]);

  return (
    
    <div className="wrapper">
        <h1>Test</h1>
      {error && <p className="error">{error}</p>}
      <h1>{title}</h1>
      <h2>Author: {author}</h2>
      <h3>Referees: {referees}</h3>
    </div>
  );
}

export default ManuscriptDetails;
