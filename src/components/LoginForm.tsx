import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  authStatus: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, authStatus }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <form id="loginForm">
      <h2>Login</h2>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" id="loginButton" onClick={handleLogin}>
        Login
      </button>
      <div id="authStatus">{authStatus}</div>
    </form>
  );
};

export default LoginForm;
