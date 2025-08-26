import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import authService from '../../../services/auth/authService';
import './login.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await authService.login(formData.email, formData.password);
            toast.current.show({
                severity: 'success',
                summary: 'Login successful',
                detail: 'Welcome to Web Auction!',
                life: 3000
            });
            navigate('/');
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Login Error',
                detail: 'Incorrect email or password. Please try again.',
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Toast ref={toast} />
            
            <div className="login-container">
                <div className="login-background">
                    <div className="login-overlay"></div>
                </div>
                
                <div className="login-content">
                    <Card className="login-card">
                        <div className="login-header">
                            <div className="login-logo">
                                <i className="pi pi-shopping-cart"></i>
                            </div>
                            <h1 className="login-title">Web Auction</h1>
                            <p className="login-subtitle">Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                    <label htmlFor="email">Email</label>
                                </span>
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Password
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required
                                        className="w-full"
                                        inputClassName="w-full"
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
                                className="w-full login-button"
                                disabled={loading}
                            />
                        </form>

                        <Divider />

                        <div className="login-links">
                            <Link to="/forgot-password" className="text-primary text-sm">
                                Forgot your password?
                            </Link>
                        </div>

                        <div className="login-signup">
                            <span className="text-600 text-sm">Don't have an account? </span>
                            <Link to="/sign-up" className="text-primary text-sm font-medium">
                                Sign up
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;