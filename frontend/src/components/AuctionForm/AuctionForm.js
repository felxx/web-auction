import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import auctionService from '../../services/auctionService';
import categoryService from '../../services/categoryService';
import ImageUpload from '../ImageUpload/ImageUpload';
import api from '../../services/api';
import { createLogger } from '../../utils/logger';
import './AuctionForm.css';

const logger = createLogger('AuctionForm');

const AuctionForm = ({ returnPath = '/admin/auctions' }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: null,
        startDateTime: null,
        endDateTime: null,
        minimumBid: 0.01
    });
    const [images, setImages] = useState([]);
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
                logger.error('Failed to load categories', err);
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
                categoryId: response.data.categoryId || null,
                startDateTime: response.data.startDateTime ? new Date(response.data.startDateTime) : null,
                endDateTime: response.data.endDateTime ? new Date(response.data.endDateTime) : null,
                minimumBid: response.data.minimumBid || 0.01
            });
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load auction.',
                life: 5000
            });
            logger.error('Failed to load auction', err);
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
        
        const toLocalISOString = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };
        
        const auction = { 
            title: formData.title, 
            description: formData.description, 
            categoryId: formData.categoryId,
            startDateTime: toLocalISOString(formData.startDateTime),
            endDateTime: toLocalISOString(formData.endDateTime),
            minimumBid: formData.minimumBid
        };
        
        try {
            let auctionId;
            
            if (id) {
                await auctionService.updateAuction(id, auction);
                auctionId = id;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Auction updated successfully!',
                    life: 3000
                });
            } else {
                const response = await auctionService.createAuction(auction);
                auctionId = response.data.id;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Auction created successfully!',
                    life: 3000
                });
            }
            
            if (images.length > 0 && auctionId) {
                try {
                    const formData = new FormData();
                    images.forEach((image) => {
                        formData.append('files', image.file);
                    });
                    
                    await api.post(`/images/auction/${auctionId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Images uploaded successfully!',
                        life: 2000
                    });
                } catch (imgErr) {
                    logger.error('Error uploading images', imgErr);
                    logger.debug('Error details:', imgErr.response?.data);
                    const errorMessage = imgErr.response?.data?.message || 'Auction saved but image upload failed';
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: errorMessage,
                        life: 4000
                    });
                }
            }
            
            setTimeout(() => navigate(returnPath), 2000);
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save auction.',
                life: 5000
            });
            logger.error('Failed to save auction', err);
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
                        <label className="field-label">
                            <i className="pi pi-images mr-2" />
                            Images (Maximum 5)
                        </label>
                        <ImageUpload 
                            onImagesChange={setImages}
                            maxImages={5}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="title" className="field-label">
                            <i className="pi pi-tag mr-2" />
                            Title *
                        </label>
                        <InputText
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter auction title"
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
                            placeholder="Enter auction description"
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

                    <div className="field">
                        <label htmlFor="minimumBid" className="field-label">
                            <i className="pi pi-money-bill mr-2" />
                            Minimum Bid *
                        </label>
                        <InputNumber
                            id="minimumBid"
                            value={formData.minimumBid}
                            onValueChange={(e) => handleInputChange('minimumBid', e.value)}
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            placeholder="Enter minimum bid"
                            className="w-full"
                            min={0.01}
                            minFractionDigits={2}
                            maxFractionDigits={2}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="startDateTime" className="field-label">
                            <i className="pi pi-calendar mr-2" />
                            Start Date and Time *
                        </label>
                        <Calendar
                            id="startDateTime"
                            value={formData.startDateTime}
                            onChange={(e) => handleInputChange('startDateTime', e.value)}
                            showTime
                            hourFormat="24"
                            placeholder="Select start date and time"
                            className="w-full"
                            required
                            disabled={loading}
                            minDate={new Date()}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="endDateTime" className="field-label">
                            <i className="pi pi-calendar mr-2" />
                            End Date and Time *
                        </label>
                        <Calendar
                            id="endDateTime"
                            value={formData.endDateTime}
                            onChange={(e) => handleInputChange('endDateTime', e.value)}
                            showTime
                            hourFormat="24"
                            placeholder="Select end date and time"
                            className="w-full"
                            required
                            disabled={loading}
                            minDate={formData.startDateTime || new Date()}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-outlined"
                            onClick={() => navigate(returnPath)}
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
