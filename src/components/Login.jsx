
import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctUser = import.meta.env.VITE_LOGIN_USER;
    const correctPass = import.meta.env.VITE_LOGIN_PASSWORD;

    if (username === correctUser && password === correctPass) {
      onLogin();
    } else {
      setError('无效的用户名或密码');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>欢迎回来</h2>
        <p>请登录以继续</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="用户名"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">登录</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
