import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import LoginPage from './pages/auth/login/login.js';
import SignUpPage from './pages/auth/sign-up/signUp.js';
import ChangePasswordPage from './pages/auth/change-password/changePassword.js';
import ForgotPasswordPage from './pages/auth/forgot-password/forgotPassword.js';
import ResetPasswordPage from './pages/auth/reset-password/resetPassword.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import CategoryList from './pages/(authenticated)/admin/categories/CategoryList.js';
import CategoryForm from './pages/(authenticated)/admin/categories/CategoryForm.js';
import AuctionList from './pages/(authenticated)/admin/auctions/AuctionList.js';
import AdminAuctionForm from './pages/(authenticated)/admin/auctions/AdminAuctionForm.js';
import Home from './pages/(unauthenticated)/home/home.js';
import PublicAuctions from './pages/(unauthenticated)/auctions/PublicAuctions.js';
import AuctionDetail from './pages/(unauthenticated)/auctions/AuctionDetail.js';
import MyAuctions from './pages/(authenticated)/seller/my-auctions/MyAuctions.js';
import SellerAuctionForm from './pages/(authenticated)/seller/my-auctions/SellerAuctionForm.js';
import MyBids from './pages/(authenticated)/buyer/my-bids/MyBids.js';
import WonAuctions from './pages/(authenticated)/buyer/won-auctions/WonAuctions.js';
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
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/auctions" element={
          <Layout>
            <PublicAuctions />
          </Layout>
        } />
        <Route path="/auctions/:id" element={
          <Layout>
            <AuctionDetail />
          </Layout>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        
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
              <AdminAuctionForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/auctions/edit/:id" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <AdminAuctionForm />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Seller routes */}
        <Route path="/my-auctions" element={
          <ProtectedRoute requiredRole="SELLER">
            <Layout>
              <MyAuctions />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/auctions/new" element={
          <ProtectedRoute requiredRole="SELLER">
            <Layout>
              <SellerAuctionForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/auctions/edit/:id" element={
          <ProtectedRoute requiredRole="SELLER">
            <Layout>
              <SellerAuctionForm />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Buyer routes */}
        <Route path="/my-bids" element={
          <ProtectedRoute requiredRole="BUYER">
            <Layout>
              <MyBids />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/won-auctions" element={
          <ProtectedRoute requiredRole="BUYER">
            <Layout>
              <WonAuctions />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
    </PrimeReactProvider>
  );
}

export default App;