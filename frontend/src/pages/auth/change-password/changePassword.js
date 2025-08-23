import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validatePassword } from '../../../utils/password-validator';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    
    const email = searchParams.get('email') || '';
    const code = searchParams.get('code') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalPasswordErrors = validatePassword(newPassword);
        const passwordsMatch = newPassword === confirmPassword;

        if (finalPasswordErrors.length === 0 && passwordsMatch) {
            
            // TODO: BACKEND CALL
            console.log("Password change submitted for", { email, code, newPassword });
        } else {
            console.error("Validation failed");
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} disabled />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    {passwordErrors.length > 0 && (
                        <div style={{ color: 'red' }}>
                            {passwordErrors.map(error => <p key={error}>{error}</p>)}
                        </div>
                    )}
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {confirmPasswordError && <p style={{ color: 'red' }}>{confirmPasswordError}</p>}
                </div>

                <div className="button-group">
                    <button type="button" onClick={() => navigate('/login')}>Cancel</button>
                    <button type="submit">Change Password</button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordPage;