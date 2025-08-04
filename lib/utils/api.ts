import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API functions
export const userAPI = {
  getProfile: () => api.get('/user/profile/'),
  updateProfile: (data: any) => api.put('/user/profile/', data),
  getDesignRequests: () => api.get('/user/design-requests/'),
  createDesignRequest: (data: any) => api.post('/user/design-requests/', data),
  updateDesignRequest: (id: number, data: any) => api.put(`/user/design-requests/${id}/`, data),
  deleteDesignRequest: (id: number) => api.delete(`/user/design-requests/${id}/`),
};

// Cart API functions
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (data: any) => api.post('/cart/add/', data),
  updateCartItem: (id: number, data: any) => api.put(`/cart/items/${id}/`, data),
  removeFromCart: (id: number) => api.delete(`/cart/items/${id}/`),
  clearCart: () => api.delete('/cart/clear/'),
};

// Favorites API functions
export const favoritesAPI = {
  getFavorites: () => api.get('/favorites/'),
  addToFavorites: (data: any) => api.post('/favorites/add/', data),
  removeFromFavorites: (id: number) => api.delete(`/favorites/${id}/`),
};

// Auth API functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login/', credentials),
  register: (userData: { username: string; email: string; password1: string; password2: string }) => 
    api.post('/auth/registration/', userData),
  socialLogin: (data: { access_token: string; provider: string }) => 
    api.post('/auth/social/login/', data),
  logout: () => api.post('/auth/logout/'),
};

export default api; 