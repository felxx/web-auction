import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/login/login.js';
import SignUpPage from './pages/auth/sign-up/sign-up.js';
import ChangePasswordPage from './pages/auth/change-password/change-password.js';
import ForgotPasswordPage from './pages/auth/forgot-password/forgot-password.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
