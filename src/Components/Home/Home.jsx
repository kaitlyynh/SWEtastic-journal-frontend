import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
// import propTypes from 'prop-types';
// import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';

const JournalTitleEP = `${BACKEND_URL}/journalTitle`;

function Home(){
    const [error, setError] = useState('');
    const [title, setTitle] = useState([]);
  
    const fetchTitle = () => {
      axios.get(JournalTitleEP)
        .then(({ data }) => {
            // Extract the value using the response key
            const journalTitle = data["Journal Title"];
            setTitle(journalTitle); 
        })
        .catch((error) => setError(`There was a problem retrieving the journal title. ${error.message}`));
    };
    useEffect(fetchTitle, []);
  return (
    <div className="wrapper">
            <header> 
                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    <h2 className="journal-title">{title}</h2>
                )}
            </header>
        </div>
    );
}
export default Home