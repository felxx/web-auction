import axios from 'axios';
import { createLogger } from '../utils/logger';

const logger = createLogger('API');
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  return config;
}, (error) => {
  logger.error('Request error', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    logger.debug(`Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    logger.error(`API Error: ${method} ${url}`, error, {
      status,
      message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;
