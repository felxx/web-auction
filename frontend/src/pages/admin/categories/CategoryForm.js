import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../../../services/categoryService';

const CategoryForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                setLoading(true);
                try {
                    const response = await categoryService.getCategory(id);
                    setName(response.data.name);
                    setDescription(response.data.description);
                } catch (err) {
                    setError('Failed to fetch category.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const category = { name, description };
        try {
            if (id) {
                await categoryService.updateCategory(id, category);
            } else {
                await categoryService.createCategory(category);
            }
            navigate('/admin/categories');
        } catch (err) {
            setError('Failed to save category.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => navigate('/admin/categories')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;