import api from './api';

const userService = {
    getCurrentUser: async () => {
        const response = await api.get('/persons/me');
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/persons/${id}`, userData);
        return response.data;
    }
};

export default userService;
