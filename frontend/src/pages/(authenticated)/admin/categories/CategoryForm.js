import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';
import categoryService from '../../../../services/categoryService';
import './CategoryForm.css';

const CategoryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        setInitialLoading(true);
        try {
            const response = await categoryService.getCategory(id);
            setFormData({
                name: response.data.name || '',
                description: response.data.description || ''
            });
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load category.',
                life: 5000
            });
            console.error(err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (isEdit) {
                await categoryService.updateCategory(id, formData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Category updated successfully.',
                    life: 3000
                });
            } else {
                await categoryService.createCategory(formData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Category created successfully.',
                    life: 3000
                });
            }
            setTimeout(() => navigate('/admin/categories'), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save category.';
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="category-form">
                <Toast ref={toast} />
                <Card className="form-card">
                    <div className="form-header">
                        <Skeleton width="200px" height="2rem" className="mb-2" />
                        <Skeleton width="300px" height="1rem" />
                    </div>
                    <div className="category-form-content">
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="5rem" />
                        </div>
                        <div className="form-actions">
                            <Skeleton width="100px" height="2.5rem" />
                            <Skeleton width="100px" height="2.5rem" />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="category-form">
            <Toast ref={toast} />
            
            <Card className="form-card">
                <div className="form-header">
                    <h2>
                        {isEdit ? 'Edit Category' : 'New Category'}
                    </h2>
                    <p>Fill in the category details below</p>
                </div>

                <form onSubmit={handleSubmit} className="category-form-content">
                    <div className="field">
                        <label htmlFor="name" className="field-label">
                            <i className="pi pi-tag mr-2" />
                            Category Name *
                        </label>
                        <InputText
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="w-full"
                            placeholder="Enter the category name"
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="description" className="field-label">
                            <i className="pi pi-align-left mr-2" />
                            Description
                        </label>
                        <InputTextarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            className="w-full"
                            placeholder="Enter a description for the category (optional)"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-outlined"
                            onClick={() => navigate('/admin/categories')}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label={isEdit ? 'Update' : 'Create'}
                            icon={isEdit ? 'pi pi-check' : 'pi pi-plus'}
                            className="p-button-success"
                            loading={loading}
                            disabled={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CategoryForm;