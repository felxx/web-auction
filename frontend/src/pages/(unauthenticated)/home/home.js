import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
    const [featuredAuctions, setFeaturedAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setFeaturedAuctions([
                    {
                        id: 1,
                        title: 'Samsung Galaxy S23 Smartphone',
                        currentBid: 1250.00,
                        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                        image: 'https://placehold.co/300x200',
                        category: 'Electronics'
                    },
                    {
                        id: 2,
                        title: 'Dell Inspiron Laptop',
                        currentBid: 2100.00,
                        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                        image:  'https://placehold.co/300x200',
                        category: 'Computing'
                    },
                    {
                        id: 3,
                        title: 'Apple Watch Series 8',
                        currentBid: 890.00,
                        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                        image:  'https://placehold.co/300x200',
                        category: 'Accessories'
                    }
                ]);

                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const getTimeRemaining = (endDate) => {
        const now = new Date();
        const difference = endDate - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            if (days > 0) {
                return `${days}d ${hours}h`;
            } else {
                return `${hours}h`;
            }
        }
        return 'Closed';
    };

    const auctionTemplate = (auction) => {
        return (
            <div className="auction-card-container">
                <Card className="auction-card">
                    <div className="auction-image">
                        <img 
                            src={auction.image || 'https://via.placeholder.com/300x200'} 
                            alt={auction.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                        />
                        <Tag value={auction.category} className="auction-category-tag" />
                    </div>
                    <div className="auction-content">
                        <h3 className="auction-title">{auction.title}</h3>
                        <div className="auction-bid">
                            <span className="bid-label">Current bid:</span>
                            <span className="bid-value">{formatPrice(auction.currentBid)}</span>
                        </div>
                        <div className="auction-time">
                            <i className="pi pi-clock"></i>
                            <span>{getTimeRemaining(auction.endDate)}</span>
                        </div>
                        <Button 
                            label="View Auction" 
                            icon="pi pi-eye"
                            className="w-full auction-button"
                            onClick={() => navigate(`/auctions/${auction.id}`)}
                        />
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to Web Auction</h1>
                    <p className="hero-subtitle">
                        Discover unique products and bid in real time.
                    </p>
                    <div className="hero-buttons">
                        <Button 
                            label="Explore Auctions" 
                            icon="pi pi-search"
                            className="hero-button primary"
                            onClick={() => navigate('/auctions')}
                        />
                    </div>
                </div>
            </div>

            <div className="featured-section">
                <div className="section-header">
                    <h2>Featured Auctions</h2>
                    <p>The best products available now</p>
                </div>
                
                <Carousel 
                    value={featuredAuctions} 
                    itemTemplate={auctionTemplate}
                    numVisible={3}
                    numScroll={1}
                    responsiveOptions={[
                        {
                            breakpoint: '1024px',
                            numVisible: 2,
                            numScroll: 1
                        },
                        {
                            breakpoint: '768px',
                            numVisible: 1,
                            numScroll: 1
                        }
                    ]}
                    showNavigators
                    showIndicators
                    className="featured-carousel"
                />
            </div>
        </div>
    );
};

export default Home;