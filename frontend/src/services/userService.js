import api from './api';

const userService = {
    getCurrentUser: async () => {
        const response = await api.get('/persons/me');
        return response.data;
    },

    getUserProfile: async (id) => {
        const response = await api.get(`/persons/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/persons/${id}`, userData);
        return response.data;
    },

    getUsers: async (page = 0, size = 10, search = '') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        
        if (search && search.trim() !== '') {
            params.append('search', search.trim());
        }
        
        const response = await api.get(`/persons?${params.toString()}`);
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/persons', userData);
        return response.data;
    },

    deleteUser: async (id) => {
        await api.delete(`/persons/${id}`);
    }
};

export default userService;
