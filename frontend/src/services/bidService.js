import api from './api';

const placeBid = async (auctionId, amount) => {
    const response = await api.post('/bids', {
        auctionId,
        amount
    });
    return response.data;
};

const getBidsByAuction = async (auctionId, page = 0, size = 10) => {
    const response = await api.get(`/bids?auctionId=${auctionId}&page=${page}&size=${size}`);
    return response.data;
};

const bidService = {
    placeBid,
    getBidsByAuction
};

export default bidService;
