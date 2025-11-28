import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import userService from '../../../../services/userService';
import './PersonList.css';

const PersonList = () => {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPersons();
    }, []);

    const fetchPersons = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers(0, 100, globalFilter);
            setPersons(data.content || []);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load persons.',
                life: 5000
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchPersons();
        }
    };

    const handleDelete = async (person) => {
        confirmDialog({
            message: `Are you sure you want to delete "${person.name}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await userService.deleteUser(person.id);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Person deleted successfully.',
                        life: 3000
                    });
                    fetchPersons();
                } catch (err) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.response?.data?.message || 'Failed to delete person.',
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
                    onClick={() => navigate(`/admin/persons/edit/${rowData.id}`)}
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

    const profilesBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-1 flex-wrap">
                {rowData.profiles && rowData.profiles.length > 0 ? (
                    rowData.profiles.map((profile, index) => (
                        <Tag 
                            key={index} 
                            value={profile}
                            severity={getProfileSeverity(profile)}
                        />
                    ))
                ) : (
                    <span style={{color: 'var(--text-color-secondary)'}}>No profiles</span>
                )}
            </div>
        );
    };

    const getProfileSeverity = (profile) => {
        switch (profile) {
            case 'ADMIN': return 'danger';
            case 'SELLER': return 'success';
            case 'BUYER': return 'info';
            default: return 'secondary';
        }
    };

    if (loading && !persons.length) {
        return (
            <div className="person-list">
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
        <div className="person-list">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <Card className="list-card">
                <div className="list-header">
                    <h2>Manage Persons</h2>
                    <p>Manage all system users and their profiles</p>
                    
                    <div className="header-actions">
                        <span className="p-input-icon-left search-input">
                            <i className="pi pi-search" />
                            <InputText 
                                placeholder="Search persons..." 
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </span>
                        <Button
                            label="New Person"
                            icon="pi pi-plus"
                            className="p-button-warning"
                            onClick={() => navigate('/admin/persons/new')}
                        />
                    </div>
                </div>

                <div className="list-content">
                    {persons.length === 0 && !loading ? (
                        <div className="empty-state">
                            <i className="pi pi-users" style={{fontSize: '3rem', color: '#6a6a6a'}}></i>
                            <h3>No persons found</h3>
                            <p>Click "New Person" to create the first person.</p>
                        </div>
                    ) : (
                        <DataTable
                            value={persons}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-sm"
                            responsiveLayout="scroll"
                            emptyMessage="No persons found."
                        >
                            <Column 
                                field="name" 
                                header="Name" 
                                sortable 
                                style={{ minWidth: '200px' }}
                            />
                            <Column 
                                field="email" 
                                header="Email" 
                                sortable
                                style={{ minWidth: '250px' }}
                            />
                            <Column 
                                field="profiles" 
                                header="Profiles" 
                                body={profilesBodyTemplate}
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

export default PersonList;