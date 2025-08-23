import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handlePasswordRecover = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setError('');
        setMessage('');

        try {
            // TODO: IMPLEMENT BACKEND REQUEST
            console.log('Requesting password reset for email:', email);

            setMessage('If an account with this email exists, a password reset link has been sent.');
            
        } catch (apiError) {
            setMessage('If an account with this email exists, a password reset link has been sent.');
            console.error('Password recovery error:', apiError);
        }
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>
            <p>Enter your email address and we will send you a link to reset your password.</p>
            
            <form onSubmit={handlePasswordRecover}>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your.email@example.com"
                    />
                </div>
                
                <div className="button-group">
                    <button type="button" onClick={() => navigate('/login')}>Cancel</button>
                    <button type="submit">Recover Password</button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;