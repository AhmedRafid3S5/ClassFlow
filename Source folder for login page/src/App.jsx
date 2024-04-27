import React from 'react';
import LoginPage from './LoginPage';

const App = () => {
  const handleLogin = (username, password) => {
    console.log('Logging in with:', username, password);
    // Here you would usually make an API call to your authentication service
  };

  return (
    <div>
      <LoginPage onLogin={handleLogin} />
    </div>
  );
};

export default App;