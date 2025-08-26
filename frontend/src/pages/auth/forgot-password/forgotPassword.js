import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import authService from '../../../services/auth/authService';
import './forgotPassword.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const handlePasswordRecover = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter your email address.',
                life: 5000
            });
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await authService.forgotPassword(email);
            setMessage('If an account with this email exists, a recovery link has been sent.');
            toast.current.show({
                severity: 'success',
                summary: 'Email sent',
                detail: 'Check your inbox for recovery instructions.',
                life: 5000
            });
        } catch (apiError) {
            setMessage('If an account with this email exists, a recovery link has been sent.');
            console.error('Password recovery error:', apiError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <Toast ref={toast} />
            
            <div className="forgot-password-container">
                <div className="forgot-password-background">
                    <div className="forgot-password-overlay"></div>
                </div>
                
                <div className="forgot-password-content">
                    <Card className="forgot-password-card">
                        <div className="forgot-password-header">
                            <div className="forgot-password-logo">
                                <i className="pi pi-key"></i>
                            </div>
                            <h1 className="forgot-password-title">Forgot your password?</h1>
                            <p className="forgot-password-subtitle">
                                Enter your email and we'll send you a link to reset your password
                            </p>
                        </div>

                        {message && (
                            <Message 
                                severity="info" 
                                text={message} 
                                className="w-full mb-3" 
                            />
                        )}

                        <form onSubmit={handlePasswordRecover} className="forgot-password-form">
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                    <label htmlFor="email">Email</label>
                                </span>
                            </div>

                            <Button 
                                type="submit" 
                                label={loading ? 'Sending...' : 'Send Recovery Link'}
                                icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-send'}
                                loading={loading}
                                className="w-full forgot-password-button"
                                disabled={loading}
                            />
                        </form>

                        <div className="forgot-password-back">
                            <Link to="/login" className="text-primary text-sm">
                                <i className="pi pi-arrow-left mr-2"></i>
                                Back to login
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;