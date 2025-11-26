import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import userService from '../../../services/userService';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '' });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await userService.getCurrentUser();
            setUser(userData);
            setEditFormData({ name: userData.name });
        } catch (err) {
            console.error('Error loading user profile:', err);
            setError('Error loading user profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditFormData({ name: user.name });
        setSaveError(null);
        setSaveSuccess(false);
        setEditDialogVisible(true);
    };

    const handleSaveEdit = async () => {
        try {
            setSaving(true);
            setSaveError(null);
            setSaveSuccess(false);
            
            const updatedUser = await userService.updateUser(user.id, {
                name: editFormData.name,
                email: user.email
            });
            setUser(updatedUser);
            setSaveSuccess(true);
            
            setTimeout(() => {
                setEditDialogVisible(false);
                setSaveSuccess(false);
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err);
            setSaveError(err.response?.data?.message || 'Error updating profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getProfileTypeLabel = (profileType) => {
        const labels = {
            'ADMIN': 'Administrator',
            'SELLER': 'Seller',
            'BUYER': 'Buyer'
        };
        return labels[profileType] || profileType;
    };

    const getProfileTypeSeverity = (profileType) => {
        const severities = {
            'ADMIN': 'danger',
            'SELLER': 'success',
            'BUYER': 'info'
        };
        return severities[profileType] || 'secondary';
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <ProgressSpinner />
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <Message severity="error" text={error} />
                <Button 
                    label="Try Again" 
                    icon="pi pi-refresh" 
                    onClick={loadUserProfile}
                    className="p-mt-3"
                />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-error">
                <Message severity="warn" text="No user found." />
            </div>
        );
    }

    const editDialogFooter = (
        <div>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                onClick={() => setEditDialogVisible(false)} 
                className="p-button-text"
                disabled={saving}
            />
            <Button 
                label="Save" 
                icon="pi pi-check" 
                onClick={handleSaveEdit}
                disabled={saving || !editFormData.name}
                loading={saving}
            />
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>

            <Card className="profile-card">
                <div className="profile-content">
                    <div className="profile-avatar">
                        <i className="pi pi-user"></i>
                    </div>

                    <div className="profile-info">
                        <div className="profile-field">
                            <label className="profile-label">
                                <i className="pi pi-user"></i> Name
                            </label>
                            <div className="profile-value">{user.name}</div>
                        </div>

                        <Divider />

                        <div className="profile-field">
                            <label className="profile-label">
                                <i className="pi pi-envelope"></i> Email
                            </label>
                            <div className="profile-value">{user.email}</div>
                        </div>

                        <Divider />

                        <div className="profile-field">
                            <label className="profile-label">
                                <i className="pi pi-users"></i> Profiles
                            </label>
                            <div className="profile-value">
                                {user.profiles && user.profiles.length > 0 ? (
                                    <div className="profile-tags">
                                        {user.profiles.map((profile, index) => (
                                            <Tag 
                                                key={index} 
                                                value={getProfileTypeLabel(profile)}
                                                severity={getProfileTypeSeverity(profile)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <span className="profile-no-data">No profiles associated</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <Button 
                            label="Edit Profile" 
                            icon="pi pi-pencil" 
                            onClick={handleEditClick}
                            className="p-button-primary"
                        />
                    </div>
                </div>
            </Card>

            <Dialog
                header="Edit Profile"
                visible={editDialogVisible}
                style={{ width: '450px' }}
                footer={editDialogFooter}
                onHide={() => setEditDialogVisible(false)}
            >
                <div className="edit-form">
                    {saveError && (
                        <Message severity="error" text={saveError} className="p-mb-3" />
                    )}
                    
                    {saveSuccess && (
                        <Message severity="success" text="Profile updated successfully!" className="p-mb-3" />
                    )}

                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText
                            id="name"
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="p-inputtext-lg"
                            placeholder="Enter your name"
                            disabled={saving}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Profile;
