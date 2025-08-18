import api from './api';

const getAuctions = (page = 0, size = 10, sort = 'title') => {
  return api.get(`/auctions?page=${page}&size=${size}&sort=${sort}`);
};

const getAuction = (id) => {
  return api.get(`/auctions/${id}`);
};

const createAuction = (auction) => {
  return api.post('/auctions', auction);
};

const updateAuction = (id, auction) => {
  return api.put(`/auctions/${id}`, auction);
};

const deleteAuction = (id) => {
  return api.delete(`/auctions/${id}`);
};

const auctionService = {
  getAuctions,
  getAuction,
  createAuction,
  updateAuction,
  deleteAuction,
};

export default auctionService;