import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const ManuscriptEP = `${BACKEND_URL}/manuscripts`;
const ManuscriptSearchEP = `${BACKEND_URL}/manuscripts/search`;
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
    const [searchQuery, setSearchQuery] = useState('');

    const fetchManuscripts = () => {
        axios.get(ManuscriptEP)
            .then(({ data }) => {
                setManuscripts(peopleObjectToArray(data)); /* Store all manuscripts */
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

    const searchManuscripts = (event) => {
        event.preventDefault();
        axios
            .get(`${ManuscriptSearchEP}?query=${searchQuery}`)
            .then(({ data }) => {
                setManuscripts(peopleObjectToArray(data));
            }
            )
            .catch((error) => setError(`Error searching manuscripts: ${error.message}`));
    };

    useEffect(fetchManuscripts, []);

    return (
        <div className="wrapper">
            <header>
                {error && <p className="error">{error}</p>}

                {/* Search Form */}
                <form onSubmit={searchManuscripts}>
                    <input 
                        type="text" 
                        placeholder="Search Manuscripts..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <button type="submit">Search</button>
                </form>

                {/* Display Manuscripts, should title be case sensitive? */}
                <ul>
                    {manuscripts
                    .filter((manuscript) => 
                        searchQuery === "" || manuscript.title.includes(searchQuery)
                    )
                    .map((manuscript, index) => (
                        <li key={index}>{manuscript.title} by {manuscript.author}</li>
                    ))}
                </ul>

                {/* Add Manuscript Form */}
                <div className="card my-3">
                    <div className="card-body d-flex mb-3">
                        <form onSubmit={addManuscript}>
                            <p className="card-text me-3"><strong>Title:</strong></p>
                            <input 
                                type="text" 
                                placeholder="Title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                            <p className="card-text"><strong>Author:</strong></p>
                            <input 
                                type="text" 
                                placeholder="Author" 
                                value={author} 
                                onChange={(e) => setAuthor(e.target.value)} 
                            />
                            <p className="card-text"><strong>Referees:</strong></p>
                            <input 
                                type="text" 
                                placeholder="Referees" 
                                value={referees} 
                                onChange={(e) => setReferees(e.target.value)} 
                            />
                            <button className="btn btn-primary" type="submit">Add Manuscript</button>
                        </form>
                    </div>
                </div>
            </header>
        </div>
    );
}
export default Manuscript;
