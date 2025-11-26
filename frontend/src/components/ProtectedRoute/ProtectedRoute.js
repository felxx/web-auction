import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/auth/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" />;
    }

    const hasRole = (roleToCheck) => {
        if (!currentUser) return false;
        
        if (currentUser.role) {
            const role = currentUser.role.replace('ROLE_', '');
            if (role === roleToCheck) return true;
        }
        
        if (currentUser.roles && Array.isArray(currentUser.roles)) {
            return currentUser.roles.some(r => {
                const role = typeof r === 'string' ? r.replace('ROLE_', '') : r;
                return role === roleToCheck;
            });
        }
        
        return false;
    };

    if (hasRole('ADMIN')) {
        return children;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

export default ProtectedRoute;
