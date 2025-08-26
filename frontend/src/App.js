import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import LoginPage from './pages/auth/login/login.js';
import SignUpPage from './pages/auth/sign-up/signUp.js';
import ChangePasswordPage from './pages/auth/change-password/changePassword.js';
import ForgotPasswordPage from './pages/auth/forgot-password/forgotPassword.js';
import ResetPasswordPage from './pages/auth/reset-password/resetPassword.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import CategoryList from './pages/admin/categories/CategoryList.js';
import CategoryForm from './pages/admin/categories/CategoryForm.js';
import AuctionList from './pages/admin/auctions/AuctionList.js';
import AuctionForm from './pages/admin/auctions/AuctionForm.js';
import Home from './pages/home/home.js';
import Layout from './components/Layout/Layout.js';

import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

function App() {
  const primeReactConfig = {
    hideOverlaysOnDocumentScrolling: true,
    ripple: true
  };

  return (
    <PrimeReactProvider value={primeReactConfig}>
      <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/change-password" element={
          <ProtectedRoute>
            <Layout>
              <ChangePasswordPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/categories" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <CategoryList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/categories/new" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <CategoryForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/categories/edit/:id" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <CategoryForm />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin/auctions" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <AuctionList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/auctions/new" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <AuctionForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/auctions/edit/:id" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <AuctionForm />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
    </PrimeReactProvider>
  );
}

export default App;