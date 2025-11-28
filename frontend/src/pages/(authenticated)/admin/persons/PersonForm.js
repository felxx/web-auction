import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { confirmDialog } from 'primereact/confirmdialog';
import userService from '../../../../services/userService';
import profileService from '../../../../services/profileService';
import personProfileService from '../../../../services/personProfileService';
import './PersonForm.css';

const PersonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = React.useRef(null);
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileType: 'BUYER'
    });
    const [errors, setErrors] = useState({});
    
    const [personProfiles, setPersonProfiles] = useState([]);
    const [availableProfiles, setAvailableProfiles] = useState([]);
    const [showAddProfileDialog, setShowAddProfileDialog] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loadingProfiles, setLoadingProfiles] = useState(false);

    const profileTypeOptions = [
        { label: 'Buyer', value: 'BUYER' },
        { label: 'Seller', value: 'SELLER' },
        { label: 'Admin', value: 'ADMIN' }
    ];

    useEffect(() => {
        if (isEditMode) {
            loadPerson();
            loadPersonProfiles();
        }
        loadAvailableProfiles();
    }, [id]);

    const loadPerson = async () => {
        try {
            setLoading(true);
            const data = await userService.getUserProfile(id);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                password: '',
                profileType: data.profiles?.[0] || ''
            });
        } catch (error) {
            console.error('Error loading person:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load person data',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const loadPersonProfiles = async () => {
        try {
            setLoadingProfiles(true);
            const response = await personProfileService.getPersonProfilesByPerson(id, 0, 100);
            const profiles = response?.data?.content || [];
            setPersonProfiles(profiles);
        } catch (error) {
            console.error('Error loading person profiles:', error);
            setPersonProfiles([]);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const loadAvailableProfiles = async () => {
        try {
            const response = await profileService.getProfiles(0, 100);
            const profiles = response?.data?.content || [];
            setAvailableProfiles(profiles);
        } catch (error) {
            console.error('Error loading available profiles:', error);
            setAvailableProfiles([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!isEditMode && !formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!isEditMode && !formData.profileType) {
            newErrors.profileType = 'Profile type is required';
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
                await userService.updateUser(id, {
                    name: formData.name,
                    email: formData.email
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Person updated successfully',
                    life: 3000
                });
            } else {
                await userService.createUser(formData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Person created successfully',
                    life: 3000
                });
            }

            setTimeout(() => navigate('/admin/persons'), 1500);
        } catch (error) {
            console.error('Error saving person:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to save person',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddProfile = async () => {
        if (!selectedProfile) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a profile',
                life: 3000
            });
            return;
        }

        try {
            await personProfileService.createPersonProfile({
                person: { id: parseInt(id) },
                profile: { id: selectedProfile.id }
            });
            
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile added successfully',
                life: 3000
            });
            setShowAddProfileDialog(false);
            setSelectedProfile(null);
            setTimeout(() => loadPersonProfiles(), 500);
        } catch (error) {
            console.error('Error adding profile:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to add profile',
                life: 3000
            });
        }
    };

    const handleRemoveProfile = (personProfile) => {
        confirmDialog({
            message: `Remove profile ${personProfile.profile?.type || 'this profile'}?`,
            header: 'Confirm Removal',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteAsync = async () => {
                    try {
                        await personProfileService.deletePersonProfile(personProfile.id);
                        
                        setPersonProfiles(current => current.filter(p => p.id !== personProfile.id));

                        toast.current?.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Profile removed successfully',
                            life: 3000
                        });
                        
                    } catch (error) {
                        console.error('Error removing profile:', error);
                        loadPersonProfiles();
                        
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.response?.data?.message || 'Failed to remove profile',
                            life: 3000
                        });
                    }
                };
                deleteAsync();
            }
        });
    };

    const profileBodyTemplate = (rowData) => {
        const profileType = rowData.profile?.type || 'UNKNOWN';
        const severity = profileType === 'ADMIN' ? 'danger' : 
                        profileType === 'SELLER' ? 'success' : 'info';
        return <Tag value={profileType} severity={severity} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() => handleRemoveProfile(rowData)}
                tooltip="Remove"
                tooltipOptions={{ position: 'top' }}
            />
        );
    };

    return (
        <div className="person-form-container">
            <Toast ref={toast} />

            <Card title={isEditMode ? 'Edit Person' : 'New Person'} className="form-card">
                <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="name">Name *</label>
                                <InputText
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? 'p-invalid' : ''}
                                    disabled={loading}
                                />
                                {errors.name && <small className="p-error">{errors.name}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="email">Email *</label>
                                <InputText
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'p-invalid' : ''}
                                    disabled={loading}
                                />
                                {errors.email && <small className="p-error">{errors.email}</small>}
                            </div>

                            {!isEditMode && (
                                <>
                                    <div className="field">
                                        <label htmlFor="password">Password *</label>
                                        <Password
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={errors.password ? 'p-invalid' : ''}
                                            disabled={loading}
                                            toggleMask
                                            feedback={false}
                                        />
                                        {errors.password && <small className="p-error">{errors.password}</small>}
                                    </div>

                                    <div className="field">
                                        <label htmlFor="profileType">Initial Profile Type *</label>
                                        <Dropdown
                                            id="profileType"
                                            name="profileType"
                                            value={formData.profileType}
                                            options={profileTypeOptions}
                                            onChange={handleInputChange}
                                            className={errors.profileType ? 'p-invalid' : ''}
                                            disabled={loading}
                                        />
                                        {errors.profileType && <small className="p-error">{errors.profileType}</small>}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="form-actions">
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => navigate('/admin/persons')}
                                type="button"
                                disabled={loading}
                            />
                            <Button
                                label={isEditMode ? 'Update' : 'Create'}
                                icon="pi pi-check"
                                className="p-button-warning"
                                type="submit"
                                loading={loading}
                            />
                        </div>
                    </form>
            </Card>

            {isEditMode && (
                <Card title="Manage Profiles" className="form-card mt-4">
                        <div className="profiles-header">
                            <Button
                                label="Add Profile"
                                icon="pi pi-plus"
                                className="p-button-warning"
                                onClick={() => setShowAddProfileDialog(true)}
                            />
                        </div>

                        <DataTable
                            value={personProfiles}
                            loading={loadingProfiles}
                            emptyMessage="No profiles assigned"
                            className="mt-3"
                        >
                            <Column field="profile.type" header="Profile" body={profileBodyTemplate} />
                            <Column body={actionBodyTemplate} header="Actions" style={{ width: '10%' }} />
                        </DataTable>
                </Card>
            )}

            <Dialog
                header="Add Profile"
                visible={showAddProfileDialog}
                style={{ width: '400px' }}
                onHide={() => {
                    setShowAddProfileDialog(false);
                    setSelectedProfile(null);
                }}
                className="profile-dialog"
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => {
                                setShowAddProfileDialog(false);
                                setSelectedProfile(null);
                            }}
                            className="p-button-text"
                        />
                        <Button
                            label="Add"
                            icon="pi pi-check"
                            onClick={handleAddProfile}
                            className="p-button-warning"
                        />
                    </div>
                }
            >
                <div className="field">
                    <label htmlFor="profile">Select Profile</label>
                    <Dropdown
                        id="profile"
                        value={selectedProfile}
                        options={availableProfiles}
                        onChange={(e) => setSelectedProfile(e.value)}
                        optionLabel="type"
                        placeholder="Select a profile"
                        className="w-full"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default PersonForm;