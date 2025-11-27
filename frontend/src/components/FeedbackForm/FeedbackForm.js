import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import feedbackService from '../../services/feedbackService';
import './FeedbackForm.css';

const FeedbackForm = ({ visible, onHide, recipientId, recipientName, auctionId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!rating || rating < 1 || rating > 5) {
            newErrors.rating = 'Please provide a rating between 1 and 5 stars';
        }
        
        if (!comment || comment.trim().length < 10) {
            newErrors.comment = 'Comment must be at least 10 characters long';
        } else if (comment.trim().length > 1000) {
            newErrors.comment = 'Comment must not exceed 1000 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await feedbackService.createFeedback({
                rating,
                comment: comment.trim(),
                recipientId,
                auctionId
            });

            setRating(5);
            setComment('');
            setErrors({});
            onHide();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setErrors({ submit: error.response?.data?.message || 'Failed to submit feedback' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRating(5);
        setComment('');
        setErrors({});
        onHide();
    };

    return (
        <Dialog
            visible={visible}
            onHide={handleClose}
            header={`Leave Feedback for ${recipientName}`}
            modal
            className="feedback-dialog"
            style={{ width: '500px' }}
        >
            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="field">
                    <label htmlFor="rating" className="field-label">
                        <i className="pi pi-star-fill mr-2" />
                        Rating *
                    </label>
                    <Rating
                        id="rating"
                        value={rating}
                        onChange={(e) => {
                            setRating(e.value);
                            if (errors.rating) setErrors({ ...errors, rating: null });
                        }}
                        cancel={false}
                        className="feedback-rating"
                    />
                    {errors.rating && <small className="p-error">{errors.rating}</small>}
                </div>

                <div className="field">
                    <label htmlFor="comment" className="field-label">
                        <i className="pi pi-comment mr-2" />
                        Comment *
                    </label>
                    <InputTextarea
                        id="comment"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            if (errors.comment) setErrors({ ...errors, comment: null });
                        }}
                        rows={5}
                        placeholder="Share your experience..."
                        className="w-full"
                        maxLength={1000}
                    />
                    <small className="char-counter">
                        {comment.length} / 1000 characters
                    </small>
                    {errors.comment && <small className="p-error d-block">{errors.comment}</small>}
                </div>

                {errors.submit && (
                    <div className="error-message">
                        <i className="pi pi-exclamation-triangle mr-2" />
                        {errors.submit}
                    </div>
                )}

                <div className="form-actions">
                    <Button
                        type="button"
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-outlined"
                        onClick={handleClose}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        label="Submit Feedback"
                        icon="pi pi-check"
                        className="p-button-success"
                        loading={loading}
                        disabled={loading}
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default FeedbackForm;
