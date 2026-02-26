import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';

export default function SuccessPage() {
  const navigate = useNavigate();
  const goBack = () => navigate('/');

  return (
    <main className={styles.container}>
      <h1>success</h1>
      <button className={styles.backButton} onClick={goBack} aria-label="Back to Login">
        Back to Login
      </button>
    </main>
  );
}
