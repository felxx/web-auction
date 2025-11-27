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
  if (filters.categoryId) {
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

const searchAuctions = (searchTerm, page = 0, size = 10) => {
  return getAuctions(page, size, 'title', { search: searchTerm });
};

const filterAuctions = (filters, page = 0, size = 10, sort = 'title') => {
  return getAuctions(page, size, sort, filters);
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
  if (filters.categoryId) {
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
  searchAuctions,
  filterAuctions,
  getMyBids,
};

export default auctionService;