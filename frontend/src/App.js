import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/login.js';
import SignUpPage from './pages/auth/sign-up/sign-up.js';
import ChangePasswordPage from './pages/auth/change-password/change-password.js';
import ForgotPasswordPage from './pages/auth/forgot-password/forgot-password.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import CategoryList from './pages/admin/categories/CategoryList.js';
import CategoryForm from './pages/admin/categories/CategoryForm.js';
import AuctionList from './pages/admin/auctions/AuctionList.js';
import AuctionForm from './pages/admin/auctions/AuctionForm.js';
import authService from './services/authService.js';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <Link to="/admin">Admin</Link> | <button onClick={handleLogout}>Logout</button>
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="" element={<div><h2>Admin Dashboard</h2></div>} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          <Route path="auctions" element={<AuctionList />} />
          <Route path="auctions/new" element={<AuctionForm />} />
          <Route path="auctions/edit/:id" element={<AuctionForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;