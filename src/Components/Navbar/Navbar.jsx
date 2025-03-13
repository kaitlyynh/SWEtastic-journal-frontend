import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Navbar.css';

const PAGES = [
  { label: 'Home', destination: '/home' },
  { label: 'View All People', destination: '/people' },
  { label: 'View All Manuscripts', destination: '/manuscripts' },
  { label: 'View All Submissions', destination: '/submissions' },
];

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}
NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function Navbar() {
  return (
    <nav>
      <ul className="wrapper">
        {PAGES.map((page) => <NavLink key={page.destination} page={page} />)}
      </ul>
    </nav>
  );
}

export default Navbar;
