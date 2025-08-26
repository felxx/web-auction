import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/auth/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && currentUser.role !== requiredRole && !currentUser.roles?.includes(requiredRole)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

export default ProtectedRoute;
