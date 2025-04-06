import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; 

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" />;
}

// prop validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
