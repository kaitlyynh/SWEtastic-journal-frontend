import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';

const PAGES = [
  { label: 'Home', destination: '/home' },
  { label: 'View All People', destination: '/people' },
  { label: 'Dashboard', destination: '/manuscripts' },
  { label: 'Submissions', destination: '/submissions' },
];

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <Nav.Link as={Link} to={destination} className="nav-link">
      {label}
    </Nav.Link>
  );
}
NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/home">Ballroom Journal</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {PAGES.map((page) => (
            <NavLink key={page.destination} page={page} />
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;

