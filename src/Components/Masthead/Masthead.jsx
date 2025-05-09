import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Masthead.css';

const MastheadEP = `${BACKEND_URL}/people/masthead`;

function Masthead() {
    const [masthead, setMasthead] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(MastheadEP)
            .then(({ data }) => {
                setMasthead(data.Masthead || {});
            })
            .catch((error) => {
                setError('Error loading masthead: ' + error.message);
            });
    }, []);

    // Group roles dynamically
    const grouped = {
        Editors: [],
        Consulting: []
    };

    for (const [role, people] of Object.entries(masthead)) {
        if (
            role.toLowerCase().includes('editor') &&
            !role.toLowerCase().includes('consulting')
        ) {
            grouped.Editors.push({ role, people });
        } else {
            grouped.Consulting.push({ role, people });
        }
    }

    const renderPeople = (role, people, showRole = true) =>
        people.map((person, index) => (
            <div key={`${role}-${index}`} className="mb-3">
                <em>{person.name}</em>
                {showRole && ` (${role.toLowerCase()})`}
                <br />
                <span>{person.affiliation}</span>
            </div>
        ));



    return (
        <div className="masthead-page">
            <header className="masthead-header">
                <h1>Masthead</h1>
            </header>
                
            <div className="masthead-content">
                {error && <p className="text-danger">{error}</p>}
        
                {/* Editors Section */}
                {grouped.Editors.length > 0 && (
                    <>
                        <h2 className="mt-4">Editors</h2>
                        {grouped.Editors.map(({ role, people }) => renderPeople(role, people, true))}
                    </>
                )}
        
                {/* Consulting Editors Section */}
                {grouped.Consulting.length > 0 && (
                    <>
                        <h2 className="mt-5">Consulting Editors</h2>
                        {grouped.Consulting.map(({ role, people }) => renderPeople(role, people, false))}
                    </>
                )}
            </div>
        </div>
    );        

}

export default Masthead;
