import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { validatePassword } from '../../../utils/password-validator';
import authService from '../../../services/auth/authService';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const token = searchParams.get('token') || '';
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    useEffect(() => {
        setPasswordErrors(validatePassword(newPassword));
    }, [newPassword]);

    useEffect(() => {
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        const finalPasswordErrors = validatePassword(newPassword);
        const passwordsMatch = newPassword === confirmPassword;

        if (finalPasswordErrors.length > 0) {
            setError('Please fix the password requirements.');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await authService.resetPassword(token, newPassword);
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (apiError) {
            console.error('Reset password error:', apiError);
            if (apiError.response?.data?.message) {
                setError(apiError.response.data.message);
            } else {
                setError('Failed to reset password. The token may be invalid or expired.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="container">
                <h2>Reset Password</h2>
                <p style={{ color: 'red' }}>Invalid or missing reset token. Please request a new password reset.</p>
                <button onClick={() => navigate('/forgot-password')}>Request New Reset</button>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Reset Password</h2>
            <p>Enter your new password below.</p>
            
            <form onSubmit={handleSubmit}>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    {passwordErrors.length > 0 && (
                        <div style={{ color: 'red' }}>
                            {passwordErrors.map(error => <p key={error}>{error}</p>)}
                        </div>
                    )}
                </div>
                
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    {confirmPasswordError && <p style={{ color: 'red' }}>{confirmPasswordError}</p>}
                </div>

                <div className="button-group">
                    <button type="button" onClick={() => navigate('/login')} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
