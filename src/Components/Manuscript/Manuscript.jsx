import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const ManuscriptEP = `${BACKEND_URL}/manuscripts`;
const Manuscript_Create_EP = `${BACKEND_URL}/manuscripts/create`;

function peopleObjectToArray(Data) {
    const keys = Object.keys(Data);
    const people = keys.map((key) => Data[key]);
    return people;
  }

function Manuscript() {
    const [error, setError] = useState('');
    const [manuscripts, setManuscripts] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [referees, setReferees] = useState('');

    const fetchManuscripts = () => {
        axios.get(ManuscriptEP)
            .then(({ data }) => {
                setManuscripts(peopleObjectToArray(data));
            })
            .catch((error) => setError(`There was a problem retrieving manuscripts. ${error.message}`));
    };

    const addManuscript = (event) => {
        event.preventDefault();
        const newManuscript = {
            title,
            author,
            referees
        };

        axios.put(Manuscript_Create_EP, newManuscript, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(() => {
            fetchManuscripts();
            setTitle(''); 
            setAuthor('');
            setReferees('');
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.message) {
                setError(`Error: ${error.response.data.message}`);
            } else {
                setError(`There was an unexpected error adding the manuscript. ${error}`);
            }
        });
    };

    useEffect(fetchManuscripts, []);

    return (
        <div className="wrapper">
            <header>
                {error && <p className="error">{error}</p>}
                
                <ul>
                    {manuscripts.map((manuscript, index) => (
                        <li key={index}>{manuscript.title} by {manuscript.author}</li>
                    ))}
                </ul>

                <form onSubmit={addManuscript}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Author" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Referees" 
                        value={referees} 
                        onChange={(e) => setReferees(e.target.value)} 
                    />
                    <button type="submit">Add Manuscript</button>
                </form>
            </header>
        </div>
    );
}
export default Manuscript;
