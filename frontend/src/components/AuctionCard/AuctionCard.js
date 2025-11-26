import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
import './AuctionCard.css';

const AuctionCard = ({ auction }) => {
    const navigate = useNavigate();
    
    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
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
    
    const getStatusSeverity = (status) => {
        switch (status) {
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
            case 'OPEN':
                return 'Aberto';
            case 'CLOSED':
                return 'Encerrado';
            case 'CANCELLED':
                return 'Cancelado';
            case 'UNDER_REVIEW':
                return 'Em Revisão';
            default:
                return status;
        }
    };
    
    const header = (
        <div className="auction-card-image-wrapper">
            {auction.imageUrl ? (
                <img
                    alt={`Imagem do leilão ${auction.title}`}
                    src={auction.imageUrl}
                    className="auction-card-image"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
                    }}
                />
            ) : (
                <div className="auction-card-no-image" role="img" aria-label="Sem imagem disponível">
                    <i className="pi pi-image" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                </div>
            )}
            <Tag
                value={getStatusLabel(auction.status)}
                severity={getStatusSeverity(auction.status)}
                className="auction-card-status-tag"
            />
        </div>
    );
    
    const footer = (
        <div className="auction-card-footer">
            <Button
                label="Ver detalhes"
                icon="pi pi-eye"
                className="p-button-text"
                onClick={() => navigate(`/auctions/${auction.id}`)}
                aria-label={`Ver detalhes do leilão ${auction.title}`}
            />
        </div>
    );
    
    return (
        <Card
            header={header}
            footer={footer}
            className="auction-card"
            role="article"
            aria-labelledby={`auction-title-${auction.id}`}
        >
            <h3 id={`auction-title-${auction.id}`} className="auction-card-title">
                {auction.title}
            </h3>
            
            <div className="auction-card-category">
                <i className="pi pi-tag" aria-hidden="true"></i>
                <span>{auction.categoryName}</span>
            </div>
            
            <p className="auction-card-description">
                {auction.description}
            </p>
            
            <div className="auction-card-info">
                <div className="auction-card-info-item">
                    <i className="pi pi-clock" aria-hidden="true"></i>
                    <div>
                        <small>Termina em:</small>
                        <strong>{formatDateTime(auction.endDateTime)}</strong>
                    </div>
                </div>
                
                <div className="auction-card-info-item">
                    <i className="pi pi-dollar" aria-hidden="true"></i>
                    <div>
                        <small>{auction.currentPrice > 0 ? 'Preço atual:' : 'Lance mínimo:'}</small>
                        <strong className="auction-card-price">
                            {formatCurrency(auction.currentPrice > 0 ? auction.currentPrice : auction.minimumBid)}
                        </strong>
                    </div>
                </div>
                
                {auction.totalBids > 0 && (
                    <div className="auction-card-info-item">
                        <i className="pi pi-users" aria-hidden="true"></i>
                        <div>
                            <small>Lances:</small>
                            <strong>{auction.totalBids}</strong>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AuctionCard;
