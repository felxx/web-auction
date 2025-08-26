import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import categoryService from '../../../services/categoryService';
import './CategoryList.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getCategories();
            setCategories(response.data.content || []);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load categories.',
                life: 5000
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category) => {
        confirmDialog({
            message: `Are you sure you want to delete the category "${category.name}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await categoryService.deleteCategory(category.id);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category deleted successfully.',
                        life: 3000
                    });
                    fetchCategories();
                } catch (err) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete category.',
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
                    onClick={() => navigate(`/admin/categories/edit/${rowData.id}`)}
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

    const createdAtBodyTemplate = (rowData) => {
        if (rowData.createdAt) {
            return new Date(rowData.createdAt).toLocaleDateString('pt-BR');
        }
        return '-';
    };

    if (loading) {
        return (
            <div className="category-list">
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
        <div className="category-list">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <Card className="list-card">
                <div className="list-header">
                    <h2>
                        Manage Categories
                    </h2>
                    <p>Manage all system categories</p>
                    
                    <Button
                        label="New Category"
                        icon="pi pi-plus"
                        className="p-button-success mb-3"
                        onClick={() => navigate('/admin/categories/new')}
                    />
                </div>

                <div className="list-content">
                    {categories.length === 0 && !loading ? (
                        <div className="empty-state">
                            <i className="pi pi-tags" style={{fontSize: '3rem', color: '#6a6a6a'}}></i>
                            <h3>No categories found</h3>
                            <p>Click "New Category" to create the first category.</p>
                        </div>
                    ) : (
                        <DataTable
                            value={categories}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-sm"
                            responsiveLayout="scroll"
                            emptyMessage="No categories found."
                        >
                            <Column 
                                field="name" 
                                header="Name" 
                                sortable 
                                style={{ minWidth: '200px' }}
                            />
                            <Column 
                                field="description" 
                                header="Description" 
                                style={{ minWidth: '250px' }}
                                body={(rowData) => (
                                    <div className="description-cell">
                                        {rowData.description?.length > 100 
                                            ? `${rowData.description.substring(0, 100)}...` 
                                            : rowData.description || 'No description'
                                        }
                                    </div>
                                )}
                            />
                            <Column 
                                field="createdAt" 
                                header="Creation Date" 
                                body={createdAtBodyTemplate}
                                sortable
                                style={{ minWidth: '150px' }}
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

export default CategoryList;