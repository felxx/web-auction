import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/auth/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" />;
    }

    // Helper function to check if user has a specific role
    const hasRole = (roleToCheck) => {
        if (!currentUser) return false;
        
        // Check in role field
        if (currentUser.role) {
            const role = currentUser.role.replace('ROLE_', '');
            if (role === roleToCheck) return true;
        }
        
        // Check in roles array
        if (currentUser.roles && Array.isArray(currentUser.roles)) {
            return currentUser.roles.some(r => {
                const role = typeof r === 'string' ? r.replace('ROLE_', '') : r;
                return role === roleToCheck;
            });
        }
        
        return false;
    };

    // ADMIN has access to everything
    if (hasRole('ADMIN')) {
        return children;
    }

    // Check if user has the required role
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

export default ProtectedRoute;
