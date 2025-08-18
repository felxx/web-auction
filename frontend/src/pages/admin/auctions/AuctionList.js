import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auctionService from '../../../services/auctionService';

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        setLoading(true);
        try {
            const response = await auctionService.getAuctions();
            setAuctions(response.data.content);
        } catch (err) {
            setError('Failed to fetch auctions.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this auction?')) {
            try {
                await auctionService.deleteAuction(id);
                fetchAuctions();
            } catch (err) {
                setError('Failed to delete auction.');
                console.error(err);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Auctions</h2>
            <Link to="/admin/auctions/new">Add Auction</Link>
            {auctions.length === 0 ? (
                <p>No auctions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map((auction) => (
                            <tr key={auction.id}>
                                <td>{auction.title}</td>
                                <td>{auction.description}</td>
                                <td>
                                    <Link to={`/admin/auctions/edit/${auction.id}`}>Edit</Link>
                                    <button onClick={() => handleDelete(auction.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AuctionList;