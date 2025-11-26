import api from './api.js';

const getCategories = (page = 0, size = 10, sort = 'name', search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort
  });
  
  if (search && search.trim() !== '') {
    params.append('search', search.trim());
  }
  
  return api.get(`/categories?${params.toString()}`);
};

const getCategory = (id) => {
  return api.get(`/categories/${id}`);
};

const createCategory = (category) => {
  return api.post('/categories', category);
};

const updateCategory = (id, category) => {
  return api.put(`/categories/${id}`, category);
};

const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

const searchCategories = (searchTerm, page = 0, size = 10) => {
  return getCategories(page, size, 'name', searchTerm);
};

const getAllCategories = async (page = 0, size = 100) => {
  const response = await api.get(`/categories?page=${page}&size=${size}&sort=name`);
  return response.data;
};

const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
  getAllCategories,
};

export default categoryService;