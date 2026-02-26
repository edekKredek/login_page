import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Accept any credentials per spec and navigate client-side
    navigate('/success');
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <form onSubmit={handleSubmit} style={{ width: 360 }}>
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
        <button type="submit" style={{ padding: '10px 16px' }}>
          Login
        </button>
      </form>
    </main>
  );
}
