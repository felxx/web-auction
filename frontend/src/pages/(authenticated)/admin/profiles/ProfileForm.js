import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import profileService from '../../../../services/profileService';
import './ProfileForm.css';

const ProfileForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = React.useRef(null);
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'BUYER'
    });
    const [errors, setErrors] = useState({});

    const profileTypeOptions = [
        { label: 'Buyer', value: 'BUYER' },
        { label: 'Seller', value: 'SELLER' },
        { label: 'Admin', value: 'ADMIN' }
    ];

    useEffect(() => {
        if (isEditMode) {
            loadProfile();
        }
    }, [id]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile(id);
            setFormData({
                type: response.data.type || ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load profile data',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            type: e.value
        }));
        if (errors.type) {
            setErrors(prev => ({
                ...prev,
                type: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.type) {
            newErrors.type = 'Profile type is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            if (isEditMode) {
                await profileService.updateProfile(id, formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Profile updated successfully',
                    life: 3000
                });
            } else {
                await profileService.createProfile(formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Profile created successfully',
                    life: 3000
                });
            }

            setTimeout(() => navigate('/admin/profiles'), 1500);
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to save profile',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-form-container">
            <Toast ref={toast} />

            <Card title={isEditMode ? 'Edit Profile' : 'New Profile'} className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="type">Profile Type *</label>
                        <Dropdown
                            id="type"
                            value={formData.type}
                            options={profileTypeOptions}
                            onChange={handleInputChange}
                            className={errors.type ? 'p-invalid' : ''}
                            disabled={loading}
                            placeholder="Select a profile type"
                        />
                        {errors.type && <small className="p-error">{errors.type}</small>}
                    </div>

                    <div className="form-actions">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => navigate('/admin/profiles')}
                            type="button"
                            disabled={loading}
                        />
                        <Button
                            label={isEditMode ? 'Update' : 'Create'}
                            icon="pi pi-check"
                            type="submit"
                            className="p-button-warning"
                            loading={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ProfileForm;