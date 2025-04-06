import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // 👈 new CSS file

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/login`, form);
      setMessage(res.data.message);

      if (res.status === 200) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", res.data.name);

        setTimeout(() => {
          navigate('/'); // home page
        }, 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Log In</h2>
        <p className="login-description">
          To view our content and dashboard, please log in or register.
        </p>
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit">Login</button>
        </form>
        <p className="login-message">{message}</p>
        <p className="login-register-link">
          Not registered yet? <Link to="/registration">Click here to sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
