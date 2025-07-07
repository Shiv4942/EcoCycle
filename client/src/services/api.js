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
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');

// Pickup API functions
export const createPickup = (pickupData) => api.post('/pickup', pickupData);
export const getPickups = () => api.get('/pickup');
export const getPickup = (id) => api.get(`/pickup/${id}`);
export const updatePickup = (id, pickupData) => api.put(`/pickup/${id}`, pickupData);
export const deletePickup = (id) => api.delete(`/pickup/${id}`);

// Product API functions
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const buyProduct = (id) => api.post(`/products/${id}/buy`);
export const getSoldProducts = (page = 1) => api.get(`/products/sold?page=${page}`);
export const getMyProducts = () => api.get('/products/my-products');

// Admin API functions
export const getUsers = (params) => api.get('/admin/users', { params });
export const getUser = (id) => api.get(`/admin/users/${id}`);
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id) => api.patch(`/admin/users/${id}/toggle-status`);
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminDashboardStats = () => api.get('/admin/dashboard/stats');
export const getRecentPickups = () => api.get('/pickup/recent');

export default api; 