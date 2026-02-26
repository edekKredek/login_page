import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import { isLoginFormValid } from '../utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // clear previous field errors
    setEmailError(null);
    setPasswordError(null);
    setError('');

    const emailVal = String(email || '').trim();
    const passVal = String(password || '').trim();

    let hasError = false;
    if (emailVal.length === 0) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (passVal.length === 0) {
      setPasswordError('Password is required');
      hasError = true;
    }
    if (hasError) return;

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
          <label style={{ display: 'block', marginBottom: 6 }} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
            aria-describedby={emailError ? 'login-email-error' : undefined}
            aria-invalid={emailError ? 'true' : 'false'}
            required
            style={{ width: '100%', padding: 8 }}
          />
          {emailError && (
            <p id="login-email-error" className="field-error" aria-live="polite">
              {emailError}
            </p>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
            aria-invalid={passwordError ? 'true' : 'false'}
            required
            style={{ width: '100%', padding: 8 }}
          />
          {passwordError && (
            <p id="login-password-error" className="field-error" aria-live="polite">
              {passwordError}
            </p>
          )}
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
