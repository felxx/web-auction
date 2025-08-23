import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/auth/login/login.js';
import SignUpPage from './pages/auth/sign-up/signUp.js';
import ChangePasswordPage from './pages/auth/change-password/changePassword.js';
import ForgotPasswordPage from './pages/auth/forgot-password/forgotPassword.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import CategoryList from './pages/admin/categories/CategoryList.js';
import CategoryForm from './pages/admin/categories/CategoryForm.js';
import AuctionList from './pages/admin/auctions/AuctionList.js';
import AuctionForm from './pages/admin/auctions/AuctionForm.js';
import authService from './services/auth/authService.js';
import Home from './pages/home/home.js'

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <button onClick={handleLogout}>Logout</button>
      </nav>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route 
            path="/admin/categories" 
            element={<ProtectedRoute requiredRole="ADMIN"><CategoryList /></ProtectedRoute>} 
        />
        <Route 
            path="/admin/categories/new" 
            element={<ProtectedRoute requiredRole="ADMIN"><CategoryForm /></ProtectedRoute>} 
        />
        <Route 
            path="/admin/categories/edit/:id" 
            element={<ProtectedRoute requiredRole="ADMIN"><CategoryForm /></ProtectedRoute>} 
        />

        <Route 
            path="/admin/auctions" 
            element={<ProtectedRoute requiredRole="ADMIN"><AuctionList /></ProtectedRoute>} 
        />
        <Route 
            path="/admin/auctions/new" 
            element={<ProtectedRoute requiredRole="ADMIN"><AuctionForm /></ProtectedRoute>} 
        />
        <Route 
            path="/admin/auctions/edit/:id" 
            element={<ProtectedRoute requiredRole="ADMIN"><AuctionForm /></ProtectedRoute>} 
        />
      </Routes>
    </div>
  );
}

export default App;