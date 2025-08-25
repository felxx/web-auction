import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import authService from '../../../services/auth/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.login(email, password);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <Card className="p-card auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Web Auction</h1>
                        <p className="auth-subtitle">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <Message 
                            severity="error" 
                            text={error} 
                            className="p-mb-3" 
                        />
                    )}

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-field">
                            <span className="p-float-label">
                                <InputText
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="p-inputtext-lg w-full"
                                />
                                <label htmlFor="email">Email</label>
                            </span>
                        </div>

                        <div className="auth-field">
                            <span className="p-float-label">
                                <Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full"
                                    inputClassName="p-inputtext-lg w-full"
                                    toggleMask
                                    feedback={false}
                                />
                                <label htmlFor="password">Password</label>
                            </span>
                        </div>

                        <Button 
                            type="submit" 
                            label={loading ? 'Signing in...' : 'Sign In'}
                            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
                            loading={loading}
                            className="p-button-success auth-button"
                            disabled={loading}
                        />
                    </form>

                    <Divider className="auth-divider" />

                    <div className="auth-links">
                        <Link 
                            to="/forgot-password" 
                            className="auth-link"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    <div className="auth-links" style={{ marginTop: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Don't have an account? </span>
                        <Link 
                            to="/sign-up" 
                            className="auth-link"
                        >
                            Sign Up
                        </Link>
                    </div>
                </Card>

                <div className="auth-footer">
                    <p className="auth-footer-text">
                        © 2025 Web Auction. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;