import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import auctionService from '../../../services/auctionService';
import categoryService from '../../../services/categoryService';
import './AuctionForm.css';

const AuctionForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data.content);
            } catch (err) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load categories.',
                    life: 5000
                });
                console.error(err);
            }
        };
        fetchCategories();

        if (id) {
            fetchAuction();
        }
    }, [id]);

    const fetchAuction = async () => {
        setInitialLoading(true);
        try {
            const response = await auctionService.getAuction(id);
            setFormData({
                title: response.data.title || '',
                description: response.data.description || '',
                categoryId: response.data.category?.id || ''
            });
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load auction.',
                life: 5000
            });
            console.error(err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const auction = { 
            title: formData.title, 
            description: formData.description, 
            category: { id: formData.categoryId } 
        };
        
        try {
            if (id) {
                await auctionService.updateAuction(id, auction);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Auction updated successfully!',
                    life: 3000
                });
            } else {
                await auctionService.createAuction(auction);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Auction created successfully!',
                    life: 3000
                });
            }
            setTimeout(() => navigate('/admin/auctions'), 1500);
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save auction.',
                life: 5000
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="auction-form">
                <Toast ref={toast} />
                <Card className="form-card">
                    <div className="form-header">
                        <Skeleton width="200px" height="2rem" className="mb-2" />
                        <Skeleton width="300px" height="1rem" />
                    </div>
                    <div className="auction-form-content">
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="5rem" />
                        </div>
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
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
        <div className="auction-form">
            <Toast ref={toast} />
            <Card className="form-card">
                <div className="form-header">
                    <h2>
                        {isEdit ? 'Edit Auction' : 'New Auction'}
                    </h2>
                    <p>Fill in the auction details below</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auction-form-content">
                    <div className="field">
                        <label htmlFor="title" className="field-label">
                            <i className="pi pi-tag mr-2" />
                            Title *
                        </label>
                        <InputText
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter the auction title"
                            className="w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="description" className="field-label">
                            <i className="pi pi-align-left mr-2" />
                            Description *
                        </label>
                        <InputTextarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter the auction description"
                            className="w-full"
                            rows={4}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="category" className="field-label">
                            <i className="pi pi-tags mr-2" />
                            Category *
                        </label>
                        <Dropdown
                            id="category"
                            value={formData.categoryId}
                            onChange={(e) => handleInputChange('categoryId', e.value)}
                            options={categories}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select a category"
                            className="w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-outlined"
                            onClick={() => navigate('/admin/auctions')}
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

export default AuctionForm;