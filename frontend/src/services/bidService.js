import api from './api';

const placeBid = async (auctionId, amount) => {
    const response = await api.post('/bids', {
        auctionId,
        amount
    });
    return response.data;
};

const bidService = {
    placeBid
};

export default bidService;
