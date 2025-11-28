import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { validatePassword } from '../../../utils/password-validator';
import authService from '../../../services/auth/authService';
import { createLogger } from '../../../utils/logger';
import './resetPassword.css';

const logger = createLogger('ResetPassword');

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toast = useRef(null);
    
    const token = searchParams.get('token') || '';
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        if (!token) {
            toast.current?.show({
                severity: 'error',
                summary: 'Invalid Token',
                detail: 'Invalid or missing reset token.',
                life: 5000
            });
        }
    }, [token]);

    useEffect(() => {
        if (newPassword) {
            const errors = validatePassword(newPassword);
            setPasswordErrors(errors);
        } else {
            setPasswordErrors([]);
        }
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
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Invalid or missing reset token.',
                life: 3000
            });
            return;
        }

        const finalPasswordErrors = validatePassword(newPassword);
        const passwordsMatch = newPassword === confirmPassword;

        if (finalPasswordErrors.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fix the password requirements.',
                life: 3000
            });
            return;
        }

        if (!passwordsMatch) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Passwords do not match.',
                life: 3000
            });
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, newPassword);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Password reset successfully! Redirecting to login...',
                life: 3000
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (apiError) {
            logger.error('Reset password error', apiError);
            const errorMessage = apiError.response?.data?.message || 
                'Failed to reset password. The token may be invalid or expired.';
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-page">
                <Toast ref={toast} />
                <div className="reset-password-container">
                    <Card className="reset-password-card">
                        <h2>Reset Password</h2>
                        <Message 
                            severity="error" 
                            text="Invalid or missing reset token. Please request a new password reset." 
                            className="w-full mb-3" 
                        />
                        <Button 
                            label="Request New Reset" 
                            onClick={() => navigate('/forgot-password')}
                            className="w-full"
                        />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page">
            <Toast ref={toast} />
            <div className="reset-password-container">
                <Card className="reset-password-card">
                    <h2>Reset Password</h2>
                    
                    <form onSubmit={handleSubmit} className="reset-password-form">
                        <div className="field">
                            <label htmlFor="newPassword">New Password</label>
                            <Password
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                feedback={false}
                                toggleMask
                                className="w-full"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                feedback={false}
                                toggleMask
                                className="w-full"
                            />
                        </div>

                        <div className="password-requirements">
                            <div className="requirements-title">Password requirements:</div>
                            <ul className="requirements-list">
                                <li className={newPassword.length >= 6 ? 'requirement-met' : 'requirement-unmet'}>
                                    At least 6 characters
                                </li>
                                <li className={/[a-z]/.test(newPassword) ? 'requirement-met' : 'requirement-unmet'}>
                                    One lowercase letter
                                </li>
                                <li className={/[A-Z]/.test(newPassword) ? 'requirement-met' : 'requirement-unmet'}>
                                    One uppercase letter
                                </li>
                                <li className={/[0-9]/.test(newPassword) ? 'requirement-met' : 'requirement-unmet'}>
                                    One number
                                </li>
                                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'requirement-met' : 'requirement-unmet'}>
                                    One special character
                                </li>
                                <li className={confirmPassword && newPassword && newPassword === confirmPassword ? 'requirement-met' : 'requirement-unmet'}>
                                    Passwords must match
                                </li>
                            </ul>
                        </div>

                        <Button 
                            type="submit" 
                            label="Reset Password" 
                            className="w-full"
                            loading={loading}
                            disabled={loading || passwordErrors.length > 0 || newPassword !== confirmPassword}
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
