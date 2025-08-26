export const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character.");
    }
    return errors;
};

export const getPasswordStrength = (password) => {
    const errors = validatePassword(password);
    if (errors.length === 0) return { strength: 'strong', label: 'Strong', color: '#4CAF50' };
    if (errors.length <= 2) return { strength: 'medium', label: 'Medium', color: '#FF9800' };
    return { strength: 'weak', label: 'Weak', color: '#F44336' };
};