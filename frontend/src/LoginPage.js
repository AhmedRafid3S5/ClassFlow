import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';


const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
<<<<<<< Updated upstream
    // Implement login logic here
    onLogin(username, password);
=======
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      if (response.data.user) {
        const { role } = response.data.user;
        onLogin(true);  // Trigger any state update or context update for logged-in user
        // Redirect based on role
        if (role === 'admin') {
          window.location.href = '/AdminDashboard'; // Adjust as needed
        } else if (role === 'student') {
          window.location.href = '/StudentDashboard'; // Adjust as needed
        } else {
          window.location.href = '/'; // Default or error case
        }
      } else {
        setMessage('Login failed');
        onLogin(false);
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Login failed');
      onLogin(false);
    }
>>>>>>> Stashed changes
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>ClassFlow</h2>
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
      </form>
    </div>
  );
};

export default LoginPage;
