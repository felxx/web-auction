import api from './api'; 

const BASE_PATH = '/public/auctions'; 

export const publicAuctionService = {
    getPublicAuctions: async (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.search) queryParams.append('search', params.search);
        if (params.categoryId !== undefined && params.categoryId !== null && typeof params.categoryId === 'number') {
            queryParams.append('categoryId', params.categoryId);
        }
        if (params.status) queryParams.append('status', params.status);
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.sort) queryParams.append('sort', params.sort);
        
        const response = await api.get(`${BASE_PATH}?${queryParams.toString()}`);
        return response.data;
    },

    getEndingSoonAuctions: async (limit = 3) => {
        const response = await api.get(`${BASE_PATH}/ending-soon?limit=${limit}`);
        return response.data;
    },

    getMostPopularAuctions: async (limit = 3) => {
        const response = await api.get(`${BASE_PATH}/most-popular?limit=${limit}`);
        return response.data;
    },

    getAuctionDetail: async (id) => {
        const response = await api.get(`${BASE_PATH}/${id}`);
        return response.data;
    }
};