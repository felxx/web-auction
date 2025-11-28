import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import profileService from '../../../../services/profileService';
import './ProfileList.css';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await profileService.getProfiles(0, 100);
            setProfiles(response.data.content || []);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load profiles.',
                life: 5000
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (profile) => {
        confirmDialog({
            message: `Are you sure you want to delete profile "${profile.type}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await profileService.deleteProfile(profile.id);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Profile deleted successfully.',
                        life: 3000
                    });
                    fetchProfiles();
                } catch (error) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response?.data?.message || 'Failed to delete profile.',
                        life: 5000
                    });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    size="small"
                    className="p-button-rounded p-button-outlined"
                    onClick={() => navigate(`/admin/profiles/edit/${rowData.id}`)}
                    tooltip="Edit"
                    tooltipOptions={{position: 'top'}}
                />
                <Button
                    icon="pi pi-trash"
                    size="small"
                    className="p-button-rounded p-button-outlined p-button-danger"
                    onClick={() => handleDelete(rowData)}
                    tooltip="Delete"
                    tooltipOptions={{position: 'top'}}
                />
            </div>
        );
    };

    const typeBodyTemplate = (rowData) => {
        const severity = rowData.type === 'ADMIN' ? 'danger' : 
                        rowData.type === 'SELLER' ? 'success' : 'info';
        return <Tag value={rowData.type} severity={severity} />;
    };

    if (loading && !profiles.length) {
        return (
            <div className="profile-list">
                <Card className="list-card">
                    <div className="list-header">
                        <Skeleton height="2rem" width="50%" className="mb-3" />
                        <Skeleton height="1rem" width="70%" />
                    </div>
                    <div className="list-content">
                        <Skeleton height="3rem" className="mb-4" />
                        <Skeleton height="2rem" className="mb-3" />
                        <Skeleton height="2rem" className="mb-3" />
                        <Skeleton height="2rem" className="mb-3" />
                        <Skeleton height="2rem" />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="profile-list">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <Card className="list-card">
                <div className="list-header">
                    <h2>Manage Profiles</h2>
                    <p>Manage system profiles and permissions</p>
                    
                    <div className="header-actions">
                        <span className="p-input-icon-left search-input">
                            <i className="pi pi-search" />
                            <InputText 
                                placeholder="Search profiles..." 
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </span>
                        <Button
                            label="New Profile"
                            icon="pi pi-plus"
                            className="p-button-warning"
                            onClick={() => navigate('/admin/profiles/new')}
                        />
                    </div>
                </div>

                <div className="list-content">
                    {profiles.length === 0 && !loading ? (
                        <div className="empty-state">
                            <i className="pi pi-id-card" style={{fontSize: '3rem', color: '#6a6a6a'}}></i>
                            <h3>No profiles found</h3>
                            <p>Click "New Profile" to create the first profile.</p>
                        </div>
                    ) : (
                        <DataTable
                            value={profiles}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-sm"
                            responsiveLayout="scroll"
                            emptyMessage="No profiles found."
                            globalFilter={globalFilter}
                        >
                            <Column 
                                field="id" 
                                header="ID" 
                                sortable
                                style={{ minWidth: '100px' }}
                            />
                            <Column 
                                field="type" 
                                header="Type" 
                                body={typeBodyTemplate}
                                sortable
                                style={{ minWidth: '200px' }}
                            />
                            <Column 
                                header="Actions" 
                                body={actionBodyTemplate}
                                style={{ minWidth: '120px', textAlign: 'center' }}
                            />
                        </DataTable>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ProfileList;