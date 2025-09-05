import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updatePreferences: (preferences) => api.put('/auth/preferences', { preferences }),
};

// Categories API methods
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getPostsByCategory: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/categories/${id}/posts${queryString ? `?${queryString}` : ''}`);
  },
};

// Posts API methods
export const postsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/posts${queryString ? `?${queryString}` : ''}`);
  },
  create: (postData) => api.post('/posts', postData),
  getById: (id) => api.get(`/posts/${id}`),
  update: (id, updateData) => api.put(`/posts/${id}`, updateData),
  delete: (id) => api.delete(`/posts/${id}`),
  getReplies: (id) => api.get(`/posts/${id}/replies`),
  createReply: (id, replyData) => api.post(`/posts/${id}/replies`, replyData),
  updateReply: (id, updateData) => api.put(`/posts/replies/${id}`, updateData),
  deleteReply: (id) => api.delete(`/posts/replies/${id}`),
};

// Search API methods
export const searchAPI = {
  posts: (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    return api.get(`/search/posts?${searchParams}`);
  },
  topics: (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    return api.get(`/search/topics?${searchParams}`);
  },
  suggestions: (query, limit = 5) => {
    const searchParams = new URLSearchParams({ q: query, limit });
    return api.get(`/search/suggestions?${searchParams}`);
  },
};

// Moderation API methods
export const moderationAPI = {
  getFlaggedContent: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/moderation/flagged${queryString ? `?${queryString}` : ''}`);
  },
  flagContent: (type, id, flagData) => api.post(`/moderation/flag/${type}/${id}`, flagData),
  reviewFlag: (flagId, reviewData) => api.put(`/moderation/review/${flagId}`, reviewData),
  getLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/moderation/logs${queryString ? `?${queryString}` : ''}`);
  },
};

// Notifications API methods
export const notificationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/notifications${queryString ? `?${queryString}` : ''}`);
  },
  getCount: () => api.get('/notifications/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (preferences) => api.put('/notifications/preferences', preferences),
  getWithNavigation: (id) => api.get(`/notifications/${id}/navigate`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;