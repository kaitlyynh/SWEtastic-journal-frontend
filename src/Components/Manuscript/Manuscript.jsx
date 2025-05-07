import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const ManuscriptEP = `${BACKEND_URL}/manuscripts`;
const ManuscriptSearchEP = `${BACKEND_URL}/manuscripts/search`;
const Manuscript_Create_EP = `${BACKEND_URL}/manuscripts/create`;
const AllStatesEP = `${BACKEND_URL}/manuscripts/ValidStates`;


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
    const [author_email, setAuthorEmail] = useState('');
    const [abstract, setAbstract] = useState('');
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [allValidStates, setAllValidStates] = useState([]);

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
        axios
            .get(AllStatesEP)
            .then(({ data }) => {
                setAllValidStates(data);
            })
            .catch((err) => {
                setError(`Error fetching states: ${err.message}`);
            });
    };

    const addManuscript = (event) => {
        event.preventDefault();
        const newManuscript = {
            title,
            author_email,
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
                setAuthorEmail('');
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
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery === "") return; // ignore empty searches
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
        <div className="wrapper pt-5">
            <header>
                {error && <p className="error">{error}</p>}
                {/* Create Manuscript*/}
                {showForm && (
                    <div className="mb-4 p-4 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
                        <h5 className="mb-3"><strong>Submit a Manuscript</strong></h5>
                        <form onSubmit={addManuscript}>
                        <div className="card p-3 mt-4 bg-light">
                            <h5>Submission Guidelines</h5>
                            <ul>
                                <li>Use your email</li>
                                <li>Keep abstract under 250 words</li>
                                <li>Text field should be formatted cleanly</li>
                                <li>Once submitted, you can assign referees</li>
                            </ul>
                            </div>
                            <br></br>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="mb-4 form-label"><strong>Title:</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="mb-4 form-label"><strong>Author Email:</strong></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={author_email}
                                        onChange={(e) => setAuthorEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="mb-4 form-label"><strong>Abstract:</strong></label>
                                <textarea
                                    className="form-control"
                                    placeholder="Abstract"
                                    value={abstract}
                                    onChange={(e) => setAbstract(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="mb-4 form-label"><strong>Text:</strong></label>
                                <textarea
                                    className="form-control"
                                    placeholder="Text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <button className="btn btn-primary" type="submit">
                                Add Manuscript
                            </button>
                            {showForm && (
                                <button
                                    className="btn btn-danger me-2"
                                    onClick={() => setShowForm(false)}
                                >
                                    Close Form
                                </button>
                            )}
                        </form>
                    </div>
                )}
                <div className="container mt-4">
                    {info}
                    <h5><strong>All Manuscripts</strong></h5>
                    {/* Search Form */}
                    <form onSubmit={searchManuscripts}>
                        <input
                            type="text"
                            placeholder="Search Manuscripts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    {/* dropdown to create manu */}
                    <div className="d-flex align-items-center mb-3">
                        <h1>
                            {!showForm && (
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => setShowForm(true)}
                                >
                                    Submit a Manuscript
                                </button>
                            )}
                        </h1>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    {/* <th>Author Email</th> */}
                                    {/* <th>Abstract</th> */}
                                    {/* <th>Text</th> */}
                                    <th>State</th>
                                    <th>View/Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {manuscripts
                                    .filter((manuscript) => {
                                        if (!manuscript || !manuscript.title) return false;
                                        return (
                                            searchQuery.trim() === "" ||
                                            manuscript.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
                                        );
                                    })
                                    .map((manuscript, index) => (
                                        <tr key={index}>
                                            <td>{manuscript.title}</td>
                                            <td>{manuscript.author}</td>
                                            {/* <td>{manuscript.author_email}</td> */}
                                            {/* <td>{manuscript.abstract}</td> */}
                                            {/* <td>{manuscript.text}</td> */}
                                            <td>{allValidStates[manuscript.curr_state]}</td>
                                            <td>
                                                <Link
                                                    to={`/manuscripts/${encodeURIComponent(manuscript.title)}`}
                                                    state={{ manuscript }}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    View/Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </header>
        </div>
    );
}
export default Manuscript;
