import React from 'react';
import propTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';


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

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const PAGES = isLoggedIn
    ? [
        { label: 'Home', destination: '/home' },
        { label: 'View All People', destination: '/people' },
        { label: 'Masthead', destination: '/masthead'},
        { label: 'Submissions', destination: '/manuscripts' },
        { label: 'Logout', onClick: handleLogout }
      ]
    : [
        { label: 'Home', destination: '/home' },
        { label: 'Register', destination: '/registration' },
        { label: 'Login', destination: '/login' }
      ];


  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand as={Link} to="/home">Ballroom Journal</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
        {PAGES.map((page, index) =>
            page.destination ? (
              <NavLink key={page.destination} page={page} />
            ) : (
              <button
                key={index}
                onClick={page.onClick}
                className="btn btn-outline-light ml-2"
              >
                {page.label}
              </button>
            )
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;

