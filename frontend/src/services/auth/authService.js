import api from '../api';
import { jwtDecode } from 'jwt-decode';

const USER_TOKEN_KEY = 'user_token';

const storeToken = (token) => {
    localStorage.setItem(USER_TOKEN_KEY, token);
};

const removeToken = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
};

const getToken = () => {
    return localStorage.getItem(USER_TOKEN_KEY);
};

const handleLoginSuccess = (token) => {
    storeToken(token);
    window.location.href = "/";
};

const getUserRoles = () => {
    const token = getToken();
    if (!token) {
        return [];
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.roles || [];
    } catch (error) {
        console.error("Invalid token:", error);
        return [];
    }
};

const getCurrentUser = () => {
    const token = getToken();
    if (!token) {
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return {
            id: decodedToken.userId || decodedToken.sub,
            name: decodedToken.name || decodedToken.username || 'User',
            email: decodedToken.email || decodedToken.sub || '',
            role: decodedToken.role || decodedToken.authorities?.[0] || 'USER',
            roles: decodedToken.roles || decodedToken.authorities || []
        };
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

const isAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return false;
    }
};

const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data && response.data.token) {
            handleLoginSuccess(response.data.token);
        }
        return response;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

const register = async (name, email, password, profileType) => {
    try {
        const response = await api.post('/auth/register', { name, email, password, profileType });
        if (response.data && response.data.token) {
            handleLoginSuccess(response.data.token);
        }
        return response;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

const logout = () => {
    removeToken();
    window.location.href = '/login';
};

const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response;
    } catch (error) {
        console.error("Forgot password error:", error);
        throw error;
    }
};

const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response;
    } catch (error) {
        console.error("Reset password error:", error);
        throw error;
    }
};

const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.post('/auth/change-password', { currentPassword, newPassword });
        return response;
    } catch (error) {
        console.error("Change password error:", error);
        throw error;
    }
};

const authService = {
    login,
    register,
    logout,
    getToken,
    getUserRoles,
    getCurrentUser,
    isAuthenticated,
    forgotPassword,
    resetPassword,
    changePassword,
};

export default authService;