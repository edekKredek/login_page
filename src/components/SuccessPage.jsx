import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Success</h1>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '1rem', padding: '8px 12px', cursor: 'pointer' }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default SuccessPage;
