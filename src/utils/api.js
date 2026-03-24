// src/utils/api.js

import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response.data, // Simplify response data access
  (error) => {
    // Handle specific error status codes
    if (error.response?.status === 401) {
      // If unauthorized (e.g., generic token expired), consider redirecting to login
      // But let the context handle logout for now
      console.warn('Unauthorized access. Please login again.');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
