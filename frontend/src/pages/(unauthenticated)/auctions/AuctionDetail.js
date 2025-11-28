import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Galleria } from 'primereact/galleria';
import { publicAuctionService } from '../../../services/publicAuctionService';
import bidService from '../../../services/bidService';
import feedbackService from '../../../services/feedbackService';
import authService from '../../../services/auth/authService';
import useAuctionUpdates from '../../../hooks/useAuctionUpdates';
import FeedbackForm from '../../../components/FeedbackForm/FeedbackForm';
import FeedbackList from '../../../components/FeedbackList/FeedbackList';
import { createLogger } from '../../../utils/logger';
import './AuctionDetail.css';

const logger = createLogger('AuctionDetail');

const AuctionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [showBidDialog, setShowBidDialog] = useState(false);
    const [bidAmount, setBidAmount] = useState(null);
    const [submittingBid, setSubmittingBid] = useState(false);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [sellerFeedbacks, setSellerFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const isAuthenticated = authService.isAuthenticated();

    const handleBidUpdate = (bidData) => {
        setAuction(prev => {
            const newBid = {
                id: bidData.bidId,
                amount: bidData.amount,
                bidDateTime: bidData.bidDateTime,
                bidderName: bidData.bidderName
            };
            
            const updatedRecentBids = prev.recentBids ? [newBid, ...prev.recentBids].slice(0, 10) : [newBid];
            
            return {
                ...prev,
                currentPrice: bidData.currentPrice,
                totalBids: bidData.totalBids,
                recentBids: updatedRecentBids
            };
        });
        
        toast.current.show({
            severity: 'info',
            summary: 'New Bid!',
            detail: `${bidData.bidderName} placed a bid of R$ ${bidData.amount.toFixed(2)}`,
            life: 3000
        });
    };

    const handleStatusUpdate = (statusData) => {
        setAuction(prev => ({
            ...prev,
            status: statusData.status
        }));
        
        const statusMessages = {
            'OPEN': 'Auction is now open for bidding!',
            'CLOSED': 'Auction has ended',
            'CANCELLED': 'Auction has been cancelled'
        };
        
        toast.current.show({
            severity: statusData.status === 'OPEN' ? 'success' : 'warn',
            summary: 'Status Update',
            detail: statusMessages[statusData.status] || 'Auction status changed',
            life: 4000
        });
    };

    useAuctionUpdates(id, handleBidUpdate, handleStatusUpdate);

    useEffect(() => {
        loadAuctionDetail();
    }, [id]);

    useEffect(() => {
        if (auction) {
            document.title = `${auction.title} — Auctions`;
            
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', auction.description || 'Online auction');
            }
        }
    }, [auction]);

    const loadAuctionDetail = async () => {
        setLoading(true);
        setError(null);
        setNotFound(false);

        try {
            const data = await publicAuctionService.getAuctionDetail(id);
            logger.debug('Auction data loaded:', data);
            logger.debug('Images in auction:', data.images);
            setAuction(data);
            
            if (data.seller?.id) {
                loadSellerFeedbacks(data.seller.id);
            }
        } catch (err) {
            logger.error('Error loading auction details', err);
            if (err.response && err.response.status === 404) {
                setNotFound(true);
            } else {
                setError('Unable to load auction details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadSellerFeedbacks = async (sellerId) => {
        setLoadingFeedbacks(true);
        try {
            const feedbacks = await feedbackService.getFeedbacksByRecipient(sellerId);
            setSellerFeedbacks(feedbacks);
        } catch (err) {
            console.error('Error loading seller feedbacks:', err);
        } finally {
            setLoadingFeedbacks(false);
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    };

    const formatCurrency = (value) => {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handlePlaceBid = () => {
        console.log('handlePlaceBid called');
        console.log('isAuthenticated:', isAuthenticated);
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const currentUser = authService.getCurrentUser();
        console.log('currentUser:', currentUser);
        console.log('auction.seller:', auction?.seller);
        
        const userEmail = currentUser.email || currentUser.id;
        
        if (currentUser && auction.seller && userEmail === auction.seller.email) {
            console.log('User is the seller! Showing toast...');
            toast.current.show({
                severity: 'warn',
                summary: 'Action not allowed',
                detail: 'You cannot place a bid on your own auction!',
                life: 4000
            });
            return;
        }

        console.log('Opening bid dialog');
        const minBidAmount = auction.currentPrice > 0 
            ? auction.currentPrice + (auction.incrementValue || 0.01)
            : auction.minimumBid;
        setBidAmount(minBidAmount);
        setShowBidDialog(true);
    };

    const handleSubmitBid = async () => {
        if (!bidAmount || bidAmount <= auction.currentPrice) {
            toast.current.show({
                severity: 'error',
                summary: 'Invalid bid',
                detail: 'Your bid must be higher than the current bid.',
                life: 3000
            });
            return;
        }

        setSubmittingBid(true);
        
        try {
            await bidService.placeBid(auction.id, bidAmount);
            
            toast.current.show({
                severity: 'success',
                summary: 'Bid placed successfully!',
                detail: `Your bid of ${formatCurrency(bidAmount)} has been placed.`,
                life: 4000
            });
            
            setShowBidDialog(false);
            setBidAmount(null);
            await loadAuctionDetail();
        } catch (error) {
            console.error('Error placing bid:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to place bid. Please try again.',
                life: 4000
            });
        } finally {
            setSubmittingBid(false);
        }
    };

    const handleFeedbackSubmit = async (feedbackData) => {
        try {
            await feedbackService.createFeedback({
                ...feedbackData,
                recipientId: auction.seller.id
            });
            
            toast.current.show({
                severity: 'success',
                summary: 'Feedback sent!',
                detail: 'Your feedback has been submitted successfully.',
                life: 4000
            });
            
            setShowFeedbackDialog(false);
            // Reload feedbacks to show the new one
            await loadSellerFeedbacks(auction.seller.id);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to submit feedback. Please try again.',
                life: 4000
            });
        }
    };

    const canLeaveFeedback = () => {
        if (!isAuthenticated || !auction) return false;
        const currentUser = authService.getCurrentUser();
        
        // Can leave feedback if:
        // 1. Auction is closed
        // 2. User is not the seller
        // 3. User has participated (has bids)
        return auction.status === 'CLOSED' && 
               currentUser?.id !== auction.seller?.id &&
               auction.currentUserHasBids === true;
    };

    const getStatusSeverity = (status) => {
        switch (status) {
            case 'SCHEDULED':
                return 'info';
            case 'OPEN':
                return 'success';
            case 'CLOSED':
                return 'danger';
            case 'CANCELLED':
                return 'warning';
            default:
                return 'info';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'SCHEDULED':
                return 'Scheduled';
            case 'OPEN':
                return 'Open';
            case 'CLOSED':
                return 'Closed';
            case 'CANCELLED':
                return 'Cancelled';
            case 'UNDER_REVIEW':
                return 'Under Review';
            default:
                return status;
        }
    };

    const itemTemplate = (item) => {
        const imageUrl = item.id ? `http://localhost:8080/images/${item.id}/data?t=${Date.now()}` : null;
        
        if (!imageUrl) {
            return (
                <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        <i className="pi pi-image" style={{ fontSize: '4rem' }}></i>
                        <p>No image</p>
                    </div>
                </div>
            );
        }
        
        return (
            <div style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <img
                    src={imageUrl}
                    alt={`Auction image ${auction?.title}`}
                    style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
                    loading="lazy"
                    onError={(e) => {
                        console.error('Error loading image:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="text-align: center; color: #999;"><i class="pi pi-image" style="font-size: 4rem;"></i><p>Failed to load image</p></div>';
                    }}
                />
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        const imageUrl = item.id ? `http://localhost:8080/images/${item.id}/data?t=${Date.now()}` : null;
        
        if (!imageUrl) {
            return (
                <div style={{ width: '100px', height: '75px', background: '#3a3a3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="pi pi-image" style={{ fontSize: '1.5rem', color: '#666' }}></i>
                </div>
            );
        }
        
        return (
            <img
                src={imageUrl}
                alt={`Thumbnail ${item.id}`}
                style={{ display: 'block', width: '100px', height: '75px', objectFit: 'cover' }}
                loading="lazy"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="width: 100px; height: 75px; background: #3a3a3a; display: flex; align-items: center; justify-content: center;"><i class="pi pi-image" style="font-size: 1.5rem; color: #666;"></i></div>';
                }}
            />
        );
    };

    if (loading) {
        return (
            <main className="auction-detail-page">
                <div className="detail-container">
                    <Button
                        icon="pi pi-arrow-left"
                        label="Back"
                        className="p-button-text mb-3"
                        onClick={() => navigate('/auctions')}
                    />
                    <div className="detail-header-skeleton">
                        <Skeleton width="60%" height="2.5rem" className="mb-2" />
                        <Skeleton width="40%" height="1.5rem" className="mb-3" />
                    </div>
                    <div className="detail-content-skeleton">
                        <Skeleton width="100%" height="400px" className="mb-3" />
                        <Skeleton width="100%" height="150px" className="mb-3" />
                        <Skeleton width="100%" height="200px" />
                    </div>
                </div>
            </main>
        );
    }

    if (notFound) {
        return (
            <main className="auction-detail-page">
                <div className="detail-container">
                    <div className="not-found-state">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '4rem', color: '#f59e0b' }}></i>
                        <h2>Auction not found</h2>
                        <p>The auction you're looking for doesn't exist or has been removed.</p>
                        <Button
                            label="Back to auctions"
                            icon="pi pi-arrow-left"
                            onClick={() => navigate('/auctions')}
                            className="mt-3"
                        />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="auction-detail-page">
                <div className="detail-container">
                    <div className="error-state">
                        <Message severity="error" text={error} />
                        <Button
                            label="Try again"
                            icon="pi pi-refresh"
                            onClick={loadAuctionDetail}
                            className="mt-3"
                        />
                        <Button
                            label="Back"
                            icon="pi pi-arrow-left"
                            className="p-button-text mt-2"
                            onClick={() => navigate('/auctions')}
                        />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="auction-detail-page">
            <Toast ref={toast} />
            <div className="detail-container">
                <Button
                    icon="pi pi-arrow-left"
                    label="Back"
                    className="p-button-text mb-3"
                    onClick={() => navigate('/auctions')}
                    aria-label="Back to auction list"
                />

                <header className="auction-header">
                    <div className="header-content">
                        <h1>{auction.title}</h1>
                        <div className="header-meta">
                            <Tag
                                value={getStatusLabel(auction.status)}
                                severity={getStatusSeverity(auction.status)}
                                className="status-tag"
                            />
                            <span className="category-tag">
                                <i className="pi pi-tag" aria-hidden="true"></i>
                                {auction.categoryName}
                            </span>
                        </div>
                    </div>
                    <div className="period-info">
                        <div className="period-item">
                            <small>Start:</small>
                            <strong>{formatDateTime(auction.startDateTime)}</strong>
                        </div>
                        <div className="period-item">
                            <small>End:</small>
                            <strong>{formatDateTime(auction.endDateTime)}</strong>
                        </div>
                    </div>
                </header>

                <div className="detail-grid">
                    <section className="gallery-section" aria-label="Galeria de imagens">
                        {auction.images && auction.images.length > 0 ? (
                            <>
                                <Galleria
                                    value={auction.images}
                                    item={itemTemplate}
                                    thumbnail={thumbnailTemplate}
                                    numVisible={5}
                                    circular
                                    style={{ maxWidth: '100%' }}
                                    showThumbnails={false}
                                    showItemNavigators={auction.images.length > 1}
                                    showIndicators
                                />
                            </>
                        ) : (
                            <div className="no-images">
                                <i className="pi pi-image" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                                <p>No images available</p>
                            </div>
                        )}
                    </section>

                    <aside className="info-panel" aria-label="Auction information">
                        <div className="info-card">
                            <h3>Bid Information</h3>
                            
                            <div className="info-item">
                                <span className="info-label">Minimum bid:</span>
                                <span className="info-value">{formatCurrency(auction.minimumBid)}</span>
                            </div>
                            
                            <div className="info-item highlight">
                                <span className="info-label">Current bid:</span>
                                <span className="info-value current-price">
                                    {formatCurrency(auction.currentPrice)}
                                </span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Total bids:</span>
                                <span className="info-value">{auction.totalBids || 0}</span>
                            </div>

                            {auction.status === 'SCHEDULED' && (
                                <Message 
                                    severity="info" 
                                    text="This auction hasn't started yet" 
                                    className="w-full mt-3"
                                />
                            )}

                            {auction.status === 'OPEN' && (
                                <Button
                                    label={isAuthenticated ? "Place bid" : "Login to bid"}
                                    icon={isAuthenticated ? "pi pi-dollar" : "pi pi-sign-in"}
                                    className="w-full mt-3 p-button-warning"
                                    onClick={handlePlaceBid}
                                    aria-label={isAuthenticated ? "Place a bid" : "Login to place bids"}
                                />
                            )}

                            {auction.status === 'CLOSED' && (
                                <Message 
                                    severity="warning" 
                                    text="This auction has ended" 
                                    className="w-full mt-3"
                                />
                            )}
                        </div>

                        {auction.seller && (
                            <div className="info-card seller-card">
                                <h3>Seller</h3>
                                <div className="seller-info">
                                    <i className="pi pi-user" aria-hidden="true"></i>
                                    <div>
                                        <strong 
                                            className="seller-name-link"
                                            onClick={() => navigate(`/sellers/${auction.seller.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {auction.seller.name}
                                        </strong>
                                        {auction.seller.totalFeedbacks > 0 && (
                                            <div 
                                                className="rating-info"
                                                onClick={() => navigate(`/sellers/${auction.seller.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="pi pi-star-fill" style={{ color: '#fbbf24' }}></i>
                                                <span>
                                                    {auction.seller.averageRating?.toFixed(1)} 
                                                    ({auction.seller.totalFeedbacks} reviews)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {canLeaveFeedback() && (
                                    <Button
                                        label="Leave Feedback"
                                        icon="pi pi-star"
                                        className="w-full mt-3 p-button-outlined"
                                        onClick={() => setShowFeedbackDialog(true)}
                                    />
                                )}
                            </div>
                        )}
                    </aside>
                </div>

                <section className="description-section" aria-labelledby="description-title">
                    <h2 id="description-title">Description</h2>
                    <div className="description-content">
                        <p className="description-short">{auction.description}</p>
                        {auction.detailedDescription && (
                            <div className="description-detailed">
                                <h3>Details</h3>
                                <p>{auction.detailedDescription}</p>
                            </div>
                        )}
                    </div>
                </section>

                {auction.recentBids && auction.recentBids.length > 0 && (
                    <section className="bids-section" aria-labelledby="bids-title">
                        <h2 id="bids-title">Latest Bids</h2>
                        <div className="bids-list" role="list">
                            {auction.recentBids.map((bid, index) => (
                                <div key={bid.id} className="bid-item" role="listitem">
                                    <div className="bid-position">#{index + 1}</div>
                                    <div className="bid-details">
                                        <strong>{bid.bidderName}</strong>
                                        <small>{formatDateTime(bid.bidDateTime)}</small>
                                    </div>
                                    <div className="bid-amount">
                                        {formatCurrency(bid.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {auction.seller && (
                    <section className="feedbacks-section" aria-labelledby="feedbacks-title">
                        <h2 id="feedbacks-title">Seller Reviews</h2>
                        <FeedbackList 
                            feedbacks={sellerFeedbacks} 
                            loading={loadingFeedbacks}
                        />
                    </section>
                )}
            </div>

            <Dialog
                header="Place Your Bid"
                visible={showBidDialog}
                style={{ width: '450px' }}
                onHide={() => {
                    setShowBidDialog(false);
                    setBidAmount(null);
                }}
                footer={
                    <div style={{ paddingTop: '1rem' }}>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => {
                                setShowBidDialog(false);
                                setBidAmount(null);
                            }}
                            className="p-button-text"
                            disabled={submittingBid}
                        />
                        <Button
                            label="Place Bid"
                            icon="pi pi-check"
                            onClick={handleSubmitBid}
                            loading={submittingBid}
                            disabled={submittingBid || !bidAmount}
                            className="p-button-success"
                        />
                    </div>
                }
            >
                <div className="bid-dialog-content" style={{ paddingBottom: '0' }}>
                    <div className="field mt-3 mb-0">
                        <label htmlFor="bidAmount" className="font-semibold">Your bid amount</label>
                        <InputNumber
                            id="bidAmount"
                            value={bidAmount}
                            onValueChange={(e) => setBidAmount(e.value)}
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            minFractionDigits={2}
                            className="w-full"
                            inputStyle={{ backgroundColor: '#1f1f1fff' }}
                            disabled={submittingBid}
                            min={auction?.currentPrice > 0 
                                ? auction.currentPrice + (auction.incrementValue || 0.01)
                                : auction?.minimumBid}
                        />
                        <small className="text-500 mt-1 block">
                            Minimum: {formatCurrency(
                                auction?.currentPrice > 0 
                                    ? auction.currentPrice + (auction.incrementValue || 0.01)
                                    : auction?.minimumBid || 0
                            )}
                        </small>
                    </div>
                </div>
            </Dialog>

            <FeedbackForm
                visible={showFeedbackDialog}
                onHide={() => setShowFeedbackDialog(false)}
                onSubmit={handleFeedbackSubmit}
                recipientName={auction?.seller?.name}
            />
        </main>
    );
};

export default AuctionDetail;
