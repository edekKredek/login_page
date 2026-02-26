import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import NotFound from './components/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
