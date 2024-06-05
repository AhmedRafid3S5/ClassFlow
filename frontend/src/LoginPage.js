// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      if (response.data.user) {
        const { username, role } = response.data.user; // Extract username from response
        onLogin(true, username); // Pass the extracted username to the onLogin callback
        // Redirect based on role
        if (role === 'admin') {
          window.location.href = '/AdminDashboard';
        } else if (role === 'student') {
          window.location.href = '/StudentDashboard';
        } else if (role === 'routineCreator') {
          window.location.href = '/RoutineMaker';
        } else if (role === 'cr') {
          window.location.href = '/CR-Dashboard'; // Adjust as needed
        } else if (role === 'teacher') {
          window.location.href = '/TeacherDashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setMessage('Login failed');
        onLogin(false, '');
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Login failed');
      onLogin(false, '');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
      <img src="/ClassFlow-Logo.png" alt="ClassFlow Logo" style={{ width: '500px' }} />
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;



