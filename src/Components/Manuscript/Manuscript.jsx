import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [info, setInfo] = useState('');
    const [manuscripts, setManuscripts] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [abstract, setAbstract] = useState('');
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchManuscripts = () => {
        axios.get(ManuscriptEP)
            .then(({ data }) => {
                const manuscriptsArray = peopleObjectToArray(data);
                setManuscripts(manuscriptsArray);
                if (manuscriptsArray.length === 0) {
                    setInfo("No manuscripts found.");
                  }
            })
            .catch((error) => setError(`There was a problem retrieving manuscripts. ${error.message}`));
    };

    const addManuscript = (event) => {
        event.preventDefault();
        const newManuscript = {
            title,
            author,
            email,
            abstract,
            text,
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
            setEmail('');
            setAbstract('');
            setText('');
            window.location.reload()
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
                    {info}
                    {manuscripts
                    .filter((manuscript) => manuscript && manuscript.title &&
                        searchQuery === "" || manuscript.title.includes(searchQuery)
                    )
                    .map((manuscript, index) => (
                        <li key={index}>
                        <Link to={`/manuscripts/${manuscript.title}`} state={{ manuscript }}>
                            {manuscript.title}
                        </Link>
                        {" "}
                        by {manuscript.author}
                    </li>
                    ))}
                </ul>

                {/* Add Manuscript Form */}
                <div className="card my-3">
                    <h5><strong>Submit a Manuscript</strong></h5>
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
                            <p className="card-text"><strong>Author Email:</strong></p>
                            <input 
                                type="text" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <p className="card-text"><strong>Abstract:</strong></p>
                            <input 
                                type="text" 
                                placeholder="Abstarct" 
                                value={abstract} 
                                onChange={(e) => setAbstract(e.target.value)} 
                            />
                            <p className="card-text"><strong>Text:</strong></p>
                            <input 
                                type="text" 
                                placeholder="Text" 
                                value={text} 
                                onChange={(e) => setText(e.target.value)} 
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
