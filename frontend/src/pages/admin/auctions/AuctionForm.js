import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import auctionService from '../../../services/auctionService';
import categoryService from '../../../services/categoryService';

const AuctionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data.content);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();

        if (id) {
            const fetchAuction = async () => {
                setLoading(true);
                try {
                    const response = await auctionService.getAuction(id);
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                    setCategoryId(response.data.category.id);
                } catch (err) {
                    setError('Failed to fetch auction.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAuction();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const auction = { title, description, category: { id: categoryId } };
        try {
            if (id) {
                await auctionService.updateAuction(id, auction);
            } else {
                await auctionService.createAuction(auction);
            }
            navigate('/admin/auctions');
        } catch (err) {
            setError('Failed to save auction.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit Auction' : 'New Auction'}</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => navigate('/admin/auctions')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AuctionForm;