import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import { useNavigate, Link } from 'react-router-dom';
import './Registration.css';

function Registration() {
  const [form, setForm] = useState({ name: '', email: '', password: '' , role: ''});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/register`, form);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">Create an Account</h2>
        <p className="registration-description">
          Register below to gain access to our journal dashboard and submissions!
        </p>
        <form onSubmit={handleSubmit} className="registration-form">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            name="role"
            placeholder="Full role"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </form>
        <p className="registration-message">{message}</p>
        <p className="registration-login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
