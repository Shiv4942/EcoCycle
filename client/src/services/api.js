import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);
export const getProfile = () => api.get('/api/auth/profile');

// Pickup API functions
export const createPickup = (pickupData) => api.post('/api/pickup', pickupData);
export const getPickups = () => api.get('/api/pickup');
export const getPickup = (id) => api.get(`/api/pickup/${id}`);
export const updatePickup = (id, pickupData) => api.put(`/api/pickup/${id}`, pickupData);
export const deletePickup = (id) => api.delete(`/api/pickup/${id}`);

// Product API functions
export const getProducts = () => api.get('/api/products');
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (productData) => api.post('/api/products', productData);
export const updateProduct = (id, productData) => api.put(`/api/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const buyProduct = (id) => api.post(`/api/products/${id}/buy`);
export const getSoldProducts = (page = 1) => api.get(`/api/products/sold?page=${page}`);
export const getMyProducts = () => api.get('/api/products/my-products');

// Admin API functions
export const getUsers = (params) => api.get('/api/admin/users', { params });
export const getUser = (id) => api.get(`/api/admin/users/${id}`);
export const updateUser = (id, userData) => api.put(`/api/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const toggleUserStatus = (id) => api.patch(`/api/admin/users/${id}/toggle-status`);
export const getAdminStats = () => api.get('/api/admin/stats');
export const getAdminDashboardStats = () => api.get('/api/admin/dashboard/stats');
export const getRecentPickups = () => api.get('/api/pickup/recent');

export default api; 