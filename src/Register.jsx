// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password validation function
  const validatePassword = (password) => {
    const isValidLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);

    return isValidLength && hasLetter && hasSymbol;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long and include both letters and symbols.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error during registration:', error); // Debugging output
      toast.error('Registration failed');
    }
  };
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '300px',
    margin: '0 auto',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };

  const linkStyle = {
    color: '#007BFF',
    textDecoration: 'none',
    marginTop: '10px',
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <ToastContainer position="bottom-right" />
      <p style={{ textAlign: 'center' }}>Already have an account? <Link to="/login" style={linkStyle}>Login here</Link></p>
    </div>
  );
};

export default Register;
