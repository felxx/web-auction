import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { Paginator } from 'primereact/paginator';
import userService from '../../../services/userService';
import feedbackService from '../../../services/feedbackService';
import FeedbackList from '../../../components/FeedbackList/FeedbackList';
import { createLogger } from '../../../utils/logger';
import './SellerProfile.css';

const logger = createLogger('SellerProfile');

const SellerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const [error, setError] = useState(null);
    const [first, setFirst] = useState(0);
    const [rows] = useState(10);

    useEffect(() => {
        loadSellerProfile();
    }, [id]);

    const loadSellerProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const userData = await userService.getUserProfile(id);
            setSeller(userData);
            
            await loadFeedbacks();
        } catch (err) {
            logger.error('Error loading seller profile', err);
            setError('Unable to load seller profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadFeedbacks = async () => {
        setLoadingFeedbacks(true);
        try {
            const feedbackData = await feedbackService.getFeedbacksByRecipient(id);
            setFeedbacks(feedbackData);
        } catch (err) {
            logger.error('Error loading feedbacks', err);
        } finally {
            setLoadingFeedbacks(false);
        }
    };

    const onPageChange = (event) => {
        setFirst(event.first);
    };

    const paginatedFeedbacks = feedbacks.slice(first, first + rows);

    if (loading) {
        return (
            <main className="seller-profile-page">
                <div className="profile-container">
                    <Button
                        icon="pi pi-arrow-left"
                        label="Back"
                        className="p-button-text mb-3"
                        onClick={() => navigate(-1)}
                    />
                    
                    <div className="profile-header">
                        <Skeleton shape="circle" size="8rem" />
                        <div style={{ flex: 1 }}>
                            <Skeleton width="60%" height="2rem" className="mb-2" />
                            <Skeleton width="40%" height="1.5rem" className="mb-3" />
                            <Skeleton width="80%" height="1rem" />
                        </div>
                    </div>

                    <div className="feedbacks-container">
                        <Skeleton width="30%" height="2rem" className="mb-3" />
                        <Skeleton height="8rem" className="mb-2" />
                        <Skeleton height="8rem" className="mb-2" />
                        <Skeleton height="8rem" />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="seller-profile-page">
                <div className="profile-container">
                    <Button
                        icon="pi pi-arrow-left"
                        label="Back"
                        className="p-button-text mb-3"
                        onClick={() => navigate(-1)}
                    />
                    <Message severity="error" text={error} className="w-full" />
                </div>
            </main>
        );
    }

    return (
        <main className="seller-profile-page">
            <div className="profile-container">
                <Button
                    icon="pi pi-arrow-left"
                    label="Back"
                    className="p-button-text mb-3"
                    onClick={() => navigate(-1)}
                />

                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className="pi pi-user"></i>
                    </div>
                    
                    <div className="profile-info">
                        <h1>{seller.name}</h1>
                        
                        {seller.totalFeedbacks > 0 && (
                            <div className="rating-display">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <i 
                                            key={i} 
                                            className={`pi ${i < Math.round(seller.averageRating) ? 'pi-star-fill' : 'pi-star'}`}
                                            style={{ color: '#fbbf24', fontSize: '1.5rem' }}
                                        />
                                    ))}
                                </div>
                                <span className="rating-text">
                                    {seller.averageRating.toFixed(1)} out of 5 ({seller.totalFeedbacks} reviews)
                                </span>
                            </div>
                        )}

                        {seller.totalFeedbacks === 0 && (
                            <p className="no-rating">No reviews yet</p>
                        )}

                        <div className="profile-stats">
                            <div className="stat-item">
                                <i className="pi pi-star-fill"></i>
                                <span>{seller.totalFeedbacks} Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="feedbacks-container">
                    <h2>Customer Reviews</h2>
                    
                    <FeedbackList 
                        feedbacks={paginatedFeedbacks} 
                        loading={loadingFeedbacks}
                    />

                    {feedbacks.length > rows && (
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={feedbacks.length}
                            onPageChange={onPageChange}
                            className="mt-4"
                        />
                    )}
                </div>
            </div>
        </main>
    );
};

export default SellerProfile;
