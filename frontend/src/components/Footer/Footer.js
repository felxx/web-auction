import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const Footer = () => {
    return (
        <footer className="footer-container">
            <Card className="auction-card footer-card">
                <div className="footer-content">
                    <div className="footer-brand-section">
                        <div className="footer-brand">
                            <i className="pi pi-shopping-cart footer-brand-icon"></i>
                            <span className="footer-brand-text">Web Auction</span>
                        </div>
                        <p className="footer-description">
                            The most reliable platform for virtual auctions in Brazil. 
                            Security, transparency and the best opportunities.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-section-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li className="footer-link-item">
                                <a href="/" className="footer-link">
                                    Home
                                </a>
                            </li>
                            <li className="footer-link-item">
                                <a href="/auctions" className="footer-link">
                                    Auctions
                                </a>
                            </li>
                            <li className="footer-link-item">
                                <a href="/faq" className="footer-link">
                                    FAQ
                                </a>
                            </li>
                            <li className="footer-link-item">
                                <a href="/contact" className="footer-link">
                                    Contact
                                </a>
                            </li>
                            <li className="footer-link-item">
                                <a href="/terms" className="footer-link">
                                    Terms of Use
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-section-title">Contact</h4>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            <i className="pi pi-phone" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                            <span>(11) 99999-9999</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            <i className="pi pi-envelope" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                            <span>contact@webauction.com</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            <i className="pi pi-map-marker" style={{ marginRight: '0.5rem', color: 'var(--primary-color)', marginTop: '0.25rem' }}></i>
                            <span>Paranavaí, PR<br />Brazil</span>
                        </div>
                    </div>
                </div>

                <Divider className="footer-divider" />

                <div className="footer-bottom">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="footer-copyright">
                            © 2025 Web Auction. Instituto Federal do Paraná. All rights reserved.
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="footer-copyright">Made with</span>
                            <i className="pi pi-heart" style={{ color: 'var(--primary-color)' }}></i>
                            <span className="footer-copyright">in Brazil</span>
                        </div>
                    </div>
                </div>
            </Card>
        </footer>
    );
};

export default Footer;
