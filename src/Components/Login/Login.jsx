import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate= useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.email]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/login`, form);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/'); // home page
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Error registering');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}


export default Registeration;