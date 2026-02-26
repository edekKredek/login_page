import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem('successDisplayed');
      if (flag) {
        setAllowed(true);
      } else {
        // If flag missing, redirect to login
        navigate('/', { replace: true });
      }
    } catch (err) {
      // If storage fails, allow rendering but do not persist
      setAllowed(true);
    }
  }, [navigate]);

  useEffect(() => {
    // Ensure the flag is set so refresh keeps the message
    try {
      sessionStorage.setItem('successDisplayed', 'true');
    } catch (err) {
      // ignore
    }
  }, []);

  const goBack = () => {
    // Prefer history back when possible, otherwise navigate to login.
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  if (!allowed) return null;

  return (
    <main className={styles.container}>
      <h1>success</h1>
      <button className={styles.backButton} onClick={goBack} aria-label="Back to Login">
        Back to Login
      </button>
    </main>
  );
}
