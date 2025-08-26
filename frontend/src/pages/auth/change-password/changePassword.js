import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { validatePassword } from '../../../utils/password-validator';
import authService from '../../../services/auth/authService';
import './changePassword.css';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const toast = useRef(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
        
        const finalPasswordErrors = validatePassword(newPassword);
        const passwordsMatch = newPassword === confirmPassword;

        if (!currentPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter your current password.',
                life: 3000
            });
            return;
        }

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
            await authService.changePassword(currentPassword, newPassword);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Password changed successfully!',
                life: 3000
            });
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (apiError) {
            console.error('Change password error:', apiError);
            const errorMessage = apiError.response?.data?.message || 
                'Failed to change password. Please check your current password.';
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

    return (
        <div className="change-password-page">
            <Toast ref={toast} />
            
            <div className="change-password-container">
                <Card className="change-password-card">
                    <div className="change-password-header">
                        <h2 className="change-password-title">
                            Change Password
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="change-password-form">
                        <div className="form-field">
                            <label htmlFor="currentPassword" className="field-label">
                                Current Password
                            </label>
                            <Password
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter your current password"
                                className="w-full"
                                inputClassName="w-full"
                                feedback={false}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="newPassword" className="field-label">
                                New Password
                            </label>
                            <Password
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full"
                                inputClassName="w-full"
                                promptLabel=""
                                feedback={false}
                                disabled={loading}
                                required
                            />
                            
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
                                </ul>
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmPassword" className="field-label">
                                Confirm New Password
                            </label>
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                className="w-full"
                                inputClassName="w-full"
                                feedback={false}
                                disabled={loading}
                                required
                            />
                            {confirmPasswordError && (
                                <Message
                                    severity="error"
                                    text={confirmPasswordError}
                                    className="confirm-password-error"
                                />
                            )}
                        </div>

                        <div className="form-actions">
                            <Button
                                type="button"
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={() => navigate('/')}
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                label={loading ? "Changing..." : "Change Password"}
                                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-save"}
                                className="p-button-success"
                                disabled={loading || passwordErrors.length > 0 || confirmPasswordError}
                                loading={loading}
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ChangePasswordPage;