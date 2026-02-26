import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

// LoginForm component: accessible form with labels, ARIA, and keyboard support.
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isFormValid = String(email || '').trim() !== '' && String(password || '').trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
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

    try {
      sessionStorage.setItem('successDisplayed', 'true');
    } catch (err) {
      // ignore
    }
    navigate('/success');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" role="form" aria-labelledby="login-form-title">
        <h2 id="login-form-title">Login</h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }} htmlFor="login-email">
            Email address
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
            aria-required="true"
            style={{ width: '100%', padding: 8 }}
            tabIndex={1}
            autoFocus
            aria-label="Email address"
          />
          {emailError && (
            <p id="login-email-error" className="field-error" aria-live="polite" role="alert">
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
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
            aria-invalid={passwordError ? 'true' : 'false'}
            required
            aria-required="true"
            style={{ width: '100%', padding: 8 }}
            tabIndex={2}
            aria-label="Password"
          />
          {passwordError && (
            <p id="login-password-error" className="field-error" aria-live="polite" role="alert">
              {passwordError}
            </p>
          )}
        </div>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={isFormValid ? 'btn-primary' : 'btn-disabled'}
          aria-disabled={!isFormValid}
          disabled={!isFormValid}
          tabIndex={3}
          onClick={(ev) => { if (!isFormValid) ev.preventDefault(); }}
          style={{ padding: '10px 16px' }}
          aria-label="Submit login"
        >
          Login
        </button>
      </form>
    </div>
  );
}
