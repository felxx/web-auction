import api from './api.js';

const getAuctions = (page = 0, size = 10, sort = 'title', filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort
  });
  
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.categoryId !== undefined && filters.categoryId !== null) {
    params.append('categoryId', filters.categoryId);
  }
  if (filters.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    params.append('endDate', filters.endDate);
  }
  if (filters.search && filters.search.trim() !== '') {
    params.append('search', filters.search.trim());
  }
  
  return api.get(`/auctions?${params.toString()}`);
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

const getMyBids = (page = 0, size = 10, sort = 'endDateTime,asc', filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort
  });
  
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.categoryId !== undefined && filters.categoryId !== null) {
    params.append('categoryId', filters.categoryId);
  }
  if (filters.search && filters.search.trim() !== '') {
    params.append('search', filters.search.trim());
  }
  
  return api.get(`/auctions/my-bids?${params.toString()}`);
};

const auctionService = {
  getAuctions,
  getAuction,
  createAuction,
  updateAuction,
  deleteAuction,
  getMyBids,
};

export default auctionService;