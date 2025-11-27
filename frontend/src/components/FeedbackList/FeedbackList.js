import React from 'react';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Avatar } from 'primereact/avatar';
import './FeedbackList.css';

const FeedbackList = ({ feedbacks = [], loading }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Ensure feedbacks is always an array
    const feedbacksArray = Array.isArray(feedbacks) ? feedbacks : [];

    if (loading) {
        return (
            <div className="feedback-list">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="feedback-card-skeleton">
                        <div className="skeleton-header">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-info">
                                <div className="skeleton-line w-40"></div>
                                <div className="skeleton-line w-60"></div>
                            </div>
                        </div>
                        <div className="skeleton-content">
                            <div className="skeleton-line w-100"></div>
                            <div className="skeleton-line w-90"></div>
                            <div className="skeleton-line w-70"></div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (feedbacksArray.length === 0) {
        return (
            <div className="empty-feedbacks">
                <i className="pi pi-comment" style={{ fontSize: '3rem', color: '#666' }}></i>
                <h3>No feedbacks yet</h3>
                <p>Be the first to leave a feedback!</p>
            </div>
        );
    }

    return (
        <div className="feedback-list">
            {feedbacksArray.map((feedback) => (
                <Card key={feedback.id} className="feedback-card">
                    <div className="feedback-header">
                        <div className="feedback-author">
                            <Avatar 
                                label={getInitials(feedback.writerName)} 
                                size="large" 
                                shape="circle"
                                className="feedback-avatar"
                            />
                            <div className="feedback-author-info">
                                <h4>{feedback.writerName}</h4>
                                <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
                            </div>
                        </div>
                        <Rating 
                            value={feedback.rating} 
                            readOnly 
                            cancel={false}
                            className="feedback-rating-display"
                        />
                    </div>
                    
                    <div className="feedback-content">
                        <p>{feedback.comment}</p>
                    </div>

                    {feedback.auctionTitle && (
                        <div className="feedback-auction-ref">
                            <i className="pi pi-tag mr-2"></i>
                            <span>Related to: {feedback.auctionTitle}</span>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default FeedbackList;
