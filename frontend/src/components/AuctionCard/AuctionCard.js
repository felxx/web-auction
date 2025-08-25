import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

const AuctionCard = ({ auction, onViewDetails, onPlaceBid }) => {
  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'ended':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const header = (
    <div className="auction-card-image">
      {auction.imageUrl ? (
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
        />
      ) : (
        <i className="pi pi-image"></i>
      )}
    </div>
  );

  const footer = (
    <div className="auction-card-footer">
      <Button 
        label="View Details" 
        icon="pi pi-eye"
        className="btn-secondary auction-card-view-button"
        onClick={() => onViewDetails?.(auction)}
      />
      {auction.status === 'ACTIVE' && (
        <Button 
          label="Place Bid" 
          icon="pi pi-dollar"
          className="btn-primary auction-card-bid-button"
          onClick={() => onPlaceBid?.(auction)}
        />
      )}
    </div>
  );

  return (
    <Card 
      title={
        <div className="auction-card-header">
          <h3 className="auction-card-title">{auction.title}</h3>
          <Tag 
            value={auction.status} 
            severity={getStatusSeverity(auction.status)}
            className="auction-card-status"
          />
        </div>
      }
      subTitle={
        <div className="auction-card-price-section">
          <div className="auction-card-price">
            <i className="pi pi-dollar"></i>
            {formatPrice(auction.currentBid || auction.startingPrice)}
          </div>
          <div className="auction-card-time-info">
            <i className="pi pi-clock auction-card-time-icon"></i>
            <span>{formatTimeRemaining(auction.endDate)}</span>
            {auction.bidCount > 0 && (
              <Badge 
                value={`${auction.bidCount} bids`} 
                severity="info" 
                className="auction-card-bid-count"
              />
            )}
          </div>
        </div>
      }
      header={header}
      footer={footer}
      className="auction-item-card auction-card-container fade-in-up"
    >
      <p className="auction-card-description">
        {auction.description?.length > 100 
          ? `${auction.description.substring(0, 100)}...` 
          : auction.description || 'No description available'
        }
      </p>
    </Card>
  );
};

export default AuctionCard;
