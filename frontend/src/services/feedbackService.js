import api from './api';

const feedbackService = {
    createFeedback: async (feedbackData) => {
        const response = await api.post('/feedbacks', feedbackData);
        return response.data;
    },

    updateFeedback: async (id, feedbackData) => {
        const response = await api.put(`/feedbacks/${id}`, feedbackData);
        return response.data;
    },

    deleteFeedback: async (id) => {
        await api.delete(`/feedbacks/${id}`);
    },

    getFeedbackById: async (id) => {
        const response = await api.get(`/feedbacks/${id}`);
        return response.data;
    },

    getFeedbacksByRecipient: async (recipientId, page = 0, size = 10) => {
        const response = await api.get(`/feedbacks?recipientId=${recipientId}&page=${page}&size=${size}&sort=createdAt,desc`);
        // Return content array from paginated response
        return response.data.content || response.data;
    },

    getFeedbacksByWriter: async (writerId, page = 0, size = 10) => {
        const response = await api.get(`/feedbacks?writerId=${writerId}&page=${page}&size=${size}&sort=createdAt,desc`);
        // Return content array from paginated response
        return response.data.content || response.data;
    },

    getAllFeedbacks: async (page = 0, size = 10) => {
        const response = await api.get(`/feedbacks?page=${page}&size=${size}&sort=createdAt,desc`);
        // Return content array from paginated response
        return response.data.content || response.data;
    }
};

export default feedbackService;
