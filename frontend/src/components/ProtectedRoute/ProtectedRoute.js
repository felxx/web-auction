import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/auth/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = authService.getToken();
    const userRoles = authService.getUserRoles();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !userRoles.includes(requiredRole)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

export default ProtectedRoute;
