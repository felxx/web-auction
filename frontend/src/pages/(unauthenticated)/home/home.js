import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { useNavigate } from 'react-router-dom';
import AuctionCard from '../../../components/AuctionCard/AuctionCard';
import { publicAuctionService } from '../../../services/publicAuctionService';
import categoryService from '../../../services/categoryService';
import './home.css';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [endingSoonAuctions, setEndingSoonAuctions] = useState([]);
    const [popularAuctions, setPopularAuctions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const endingSoonResponse = await publicAuctionService.getEndingSoonAuctions(3);
                setEndingSoonAuctions(endingSoonResponse || []);

                const popularResponse = await publicAuctionService.getMostPopularAuctions(3);
                setPopularAuctions(popularResponse || []);

                const categoriesResponse = await categoryService.getAllCategories(0, 15);
                setCategories(categoriesResponse.content || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = () => {
        navigate(`/auctions?search=${searchTerm}`);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/auctions?categoryId=${categoryId}`);
    };

    return (
        <div className="home-page">
            {/* Hero Banner with Search */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to Web Auction</h1>
                    <p className="hero-subtitle">
                        Discover unique products and bid in real time.
                    </p>
                    <div className="hero-search">
                        <span className="p-input-icon-left search-wrapper">
                            <i className="pi pi-search" />
                            <InputText
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search for auctions..."
                                className="hero-search-input"
                            />
                        </span>
                    </div>
                    <div className="hero-button-container">
                        <Button
                            label="Explore Auctions"
                            icon="pi pi-search"
                            className="hero-search-button"
                            onClick={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Ending Soon Section */}
            <div className="section-container">
                <div className="section-header">
                    <h2>Ending Soon</h2>
                    <p>Auctions ending in the next 24 hours</p>
                </div>
                {loading ? (
                    <div className="auctions-grid">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} height="400px" borderRadius="15px" />
                        ))}
                    </div>
                ) : (
                    <div className="auctions-grid">
                        {endingSoonAuctions.slice(0, 3).map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                )}
                {!loading && endingSoonAuctions.length === 0 && (
                    <p className="no-auctions">No auctions ending soon</p>
                )}
            </div>

            {/* Popular Auctions Section */}
            <div className="section-container">
                <div className="section-header">
                    <h2>Most Popular</h2>
                    <p>Auctions with the most bids</p>
                </div>
                {loading ? (
                    <div className="auctions-grid">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} height="400px" borderRadius="15px" />
                        ))}
                    </div>
                ) : (
                    <div className="auctions-grid">
                        {popularAuctions.slice(0, 3).map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                )}
                {!loading && popularAuctions.length === 0 && (
                    <p className="no-auctions">No popular auctions available</p>
                )}
            </div>

            {/* Categories Grid */}
            <div className="section-container">
                <div className="section-header">
                    <h2>Browse by Category</h2>
                    <p>Find auctions in your favorite categories</p>
                </div>
                {loading ? (
                    <div className="categories-grid">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} height="120px" borderRadius="15px" />
                        ))}
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="category-card"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <i className="pi pi-tag category-icon"></i>
                                <h3>{category.name}</h3>
                                <p>{category.description || 'Browse category'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* How It Works Section */}
            <div className="section-container how-it-works-section">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Start bidding in three simple steps</p>
                </div>
                <div className="how-it-works-grid">
                    <div className="how-it-works-card">
                        <div className="step-number">1</div>
                        <i className="pi pi-user-plus step-icon"></i>
                        <h3>Create an Account</h3>
                        <p>Sign up quickly and securely to start your auction journey</p>
                    </div>
                    <div className="how-it-works-card">
                        <div className="step-number">2</div>
                        <i className="pi pi-search step-icon"></i>
                        <h3>Find Your Item</h3>
                        <p>Browse through our curated selection of unique products</p>
                    </div>
                    <div className="how-it-works-card">
                        <div className="step-number">3</div>
                        <i className="pi pi-dollar step-icon"></i>
                        <h3>Place Your Bid</h3>
                        <p>Bid in real-time and compete for the items you want</p>
                    </div>
                </div>
                <div className="how-it-works-cta">
                    <Button
                        label="Get Started Now"
                        icon="pi pi-arrow-right"
                        className="cta-button"
                        onClick={() => navigate('/sign-up')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;