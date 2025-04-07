import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
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
        <Container className="masthead-page my-5">
            <h1 className="text-center mb-5">MASTHEAD</h1>
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

        </Container>
    );
}

export default Masthead;
