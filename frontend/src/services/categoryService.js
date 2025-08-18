import api from './api';

const getCategories = (page = 0, size = 10, sort = 'name') => {
  return api.get(`/categories?page=${page}&size=${size}&sort=${sort}`);
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

const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;