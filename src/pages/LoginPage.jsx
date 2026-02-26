import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import { isLoginFormValid } from '../utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate inputs, prevent submit when invalid
    if (!isLoginFormValid(email, password)) {
      setError('Please enter both email and password.');
      return;
    }

    // Accept any credentials per spec, persist a flag and navigate client-side
    try {
      sessionStorage.setItem('successDisplayed', 'true');
    } catch (err) {
      // ignore storage errors
    }
    navigate('/success');
  };

  const [error, setError] = useState('');

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        </div>
        {error && (
          <div style={{ color: 'var(--color-primary)', marginBottom: 12 }} role="alert">
            {error}
          </div>
        )}
        <button type="submit" style={{ padding: '10px 16px' }}>
          Login
        </button>
      </form>
    </div>
  );
}
