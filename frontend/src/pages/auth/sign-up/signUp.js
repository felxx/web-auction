import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import authService from '../../../services/auth/authService';
import { validatePassword, getPasswordStrength } from '../../../utils/password-validator';
import './signUp.css';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileType: 'BUYER'
    });
    const [loading, setLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const profileOptions = [
        { label: 'Buyer', value: 'BUYER' },
        { label: 'Seller', value: 'SELLER' },
        { label: 'Admin', value: 'ADMIN' }
    ];

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            const errors = validatePassword(value);
            setPasswordErrors(errors);
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        const passwordValidationErrors = validatePassword(formData.password);
        if (passwordValidationErrors.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Invalid Password',
                detail: 'Password does not meet security requirements.',
                life: 5000
            });
            setPasswordErrors(passwordValidationErrors);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Password Mismatch',
                detail: 'Passwords do not match. Please check and try again.',
                life: 5000
            });
            return;
        }
        
        setLoading(true);
        
        try {
            await authService.register(
                formData.name, 
                formData.email, 
                formData.password, 
                formData.profileType
            );
            toast.current.show({
                severity: 'success',
                summary: 'Registration Successful',
                detail: 'Account created successfully! Please login to continue.',
                life: 5000
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error creating account. Please try again.';
            toast.current.show({
                severity: 'error',
                summary: 'Registration Error',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <Toast ref={toast} />
            
            <div className="signup-container">
                <div className="signup-background">
                    <div className="signup-overlay"></div>
                </div>
                
                <div className="signup-content">
                    <Card className="signup-card">
                        <div className="signup-header">
                            <div className="signup-logo">
                                <i className="pi pi-user-plus"></i>
                            </div>
                            <h1 className="signup-title">Create Account</h1>
                            <p className="signup-subtitle">Join Web Auction!</p>
                        </div>

                        <form onSubmit={handleSignUp} className="signup-form">
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                    <label htmlFor="name">Name</label>
                                </span>
                            </div>

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
                                <span className="p-float-label password-field-wrapper">
                                    <InputText
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required
                                        className="w-full password-input"
                                    />
                                    <label htmlFor="password">Password</label>
                                    <Button
                                        type="button"
                                        icon={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                                        className="p-button-text password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    />
                                </span>
                            </div>

                            <div className="field">
                                <span className="p-float-label password-field-wrapper">
                                    <InputText
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        required
                                        className="w-full password-input"
                                    />
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <Button
                                        type="button"
                                        icon={showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                                        className="p-button-text password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    />
                                </span>
                                
                                <div className="password-requirements">
                                    <div className="requirements-title">Password requirements:</div>
                                    <ul className="requirements-list">
                                        <li className={formData.password.length >= 6 ? 'requirement-met' : 'requirement-unmet'}>
                                            At least 6 characters
                                        </li>
                                        <li className={/[a-z]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                                            One lowercase letter
                                        </li>
                                        <li className={/[A-Z]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                                            One uppercase letter
                                        </li>
                                        <li className={/[0-9]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                                            One number
                                        </li>
                                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'requirement-met' : 'requirement-unmet'}>
                                            One special character
                                        </li>
                                        <li className={formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'requirement-met' : 'requirement-unmet'}>
                                            Passwords match
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="profileType"
                                        value={formData.profileType}
                                        options={profileOptions}
                                        onChange={(e) => handleInputChange('profileType', e.value)}
                                        className="w-full"
                                    />
                                </span>
                            </div>

                            <Button 
                                type="submit" 
                                label={loading ? 'Creating account...' : 'Create Account'}
                                icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'}
                                loading={loading}
                                className="w-full signup-button"
                                disabled={loading}
                            />
                        </form>

                        <Divider />

                        <div className="signup-login">
                            <span className="text-600 text-sm">Already have an account? </span>
                            <Link to="/login" className="text-primary text-sm font-medium">
                                Sign in
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;