import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const HeroSection = () => {
  return (
    <div className="hero-section auction-hero fade-in-up">
      <div className="hero-content auction-hero-content">
        <h1 className="hero-title">
          Web Auction
        </h1>
        <p className="hero-description">
          The most secure and reliable platform for virtual auctions. 
          Find unique products, place your bids and win incredible opportunities!
        </p>
        <div className="hero-buttons">
          <Button 
            label="Explore Auctions" 
            icon="pi pi-search"
            className="btn-primary hero-button pulse-animation"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, description }) => (
  <Card className="auction-card stats-card">
    <div className="stats-card-content">
      <div className="stats-card-icon">
        <i className={icon}></i>
      </div>
      <div>
        <h3 className="stats-card-value">{value}</h3>
        <h4 className="stats-card-title">{title}</h4>
        <p className="stats-card-description">{description}</p>
      </div>
    </div>
  </Card>
);

const FeatureCard = ({ icon, title, description }) => (
  <Card className="auction-card feature-card">
    <div className="feature-card-content">
      <div className="feature-card-icon">
        <i className={icon}></i>
      </div>
      <div className="feature-card-content-text">
        <h4 className="feature-card-title">{title}</h4>
        <p className="feature-card-description">{description}</p>
      </div>
    </div>
  </Card>
);

export { HeroSection, StatsCard, FeatureCard };
