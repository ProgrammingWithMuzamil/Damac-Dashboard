import axios from 'axios';
import { store } from '../store';
import { selectToken } from '../store/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
});


const DEBOUNCE_DELAY = 200;
const debounceMap = new Map();

const debounceRequest = (config) => {
  const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`;

  if (debounceMap.has(requestKey)) {
    clearTimeout(debounceMap.get(requestKey).timer);
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      debounceMap.delete(requestKey);
      resolve(config);
    }, DEBOUNCE_DELAY);

    debounceMap.set(requestKey, { timer, resolve });
  });
};

api.interceptors.request.use(
  async (config) => {
    // Get token from Redux store first, fallback to localStorage
    const state = store.getState();
    let accessToken = selectToken(state);
    
    if (!accessToken) {
      accessToken = localStorage.getItem('token');
    }

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.method === 'get') {
      return await debounceRequest(config);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // CRITICAL: Clear auth state and token immediately
      localStorage.removeItem('token');
      
      // Dispatch custom event for auth handling
      window.dispatchEvent(new CustomEvent('auth:unauthorized', {
        detail: { error }
      }));
      
      // Prevent further retries
      return Promise.reject(error);
    }

    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);
