import axios from 'axios';

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-domain.com' // Replace with your production backend URL
  : 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - only add token for protected routes
api.interceptors.request.use(
  (config) => {
    // Only add token for user management and POST/PUT/DELETE requests
    const isProtectedRoute = config.url?.includes('/users') || 
                           !['GET', 'HEAD', 'OPTIONS'].includes(config.method?.toUpperCase());
    
    if (isProtectedRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  
  create: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await api.get('/api/properties');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  },
  
  create: async (propertyData) => {
    // Check if propertyData contains a file (FormData)
    if (propertyData instanceof FormData) {
      const response = await api.post('/api/properties', propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.post('/api/properties', propertyData);
      return response.data;
    }
  },
  
  update: async (id, propertyData) => {
    // Check if propertyData contains a file (FormData)
    if (propertyData instanceof FormData) {
      const response = await api.put(`/api/properties/${id}`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.put(`/api/properties/${id}`, propertyData);
      return response.data;
    }
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/properties/${id}`);
    return response.data;
  },
};

// Collaborations API
export const collaborationsAPI = {
  getAll: async () => {
    const response = await api.get('/api/collaborations');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/collaborations/${id}`);
    return response.data;
  },
  
  create: async (collaborationData) => {
    // Check if collaborationData contains files (FormData)
    if (collaborationData instanceof FormData) {
      const response = await api.post('/api/collaborations', collaborationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.post('/api/collaborations', collaborationData);
      return response.data;
    }
  },
  
  update: async (id, collaborationData) => {
    // Check if collaborationData contains files (FormData)
    if (collaborationData instanceof FormData) {
      const response = await api.put(`/api/collaborations/${id}`, collaborationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.put(`/api/collaborations/${id}`, collaborationData);
      return response.data;
    }
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/collaborations/${id}`);
    return response.data;
  },
};

// Slides API
export const slidesAPI = {
  getAll: async () => {
    const response = await api.get('/api/slides');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/slides/${id}`);
    return response.data;
  },
  
  create: async (slideData) => {
    // Check if slideData contains a file (FormData)
    if (slideData instanceof FormData) {
      const response = await api.post('/api/slides', slideData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.post('/api/slides', slideData);
      return response.data;
    }
  },
  
  update: async (id, slideData) => {
    // Check if slideData contains a file (FormData)
    if (slideData instanceof FormData) {
      const response = await api.put(`/api/slides/${id}`, slideData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.put(`/api/slides/${id}`, slideData);
      return response.data;
    }
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/slides/${id}`);
    return response.data;
  },
};

// YourPerfect API
export const yourperfectAPI = {
  getAll: async () => {
    const response = await api.get('/api/yourperfect');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/yourperfect/${id}`);
    return response.data;
  },
  
  create: async (itemData) => {
    // Check if itemData contains a file (FormData)
    if (itemData instanceof FormData) {
      const response = await api.post('/api/yourperfect', itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.post('/api/yourperfect', itemData);
      return response.data;
    }
  },
  
  update: async (id, itemData) => {
    // Check if itemData contains a file (FormData)
    if (itemData instanceof FormData) {
      const response = await api.put(`/api/yourperfect/${id}`, itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.put(`/api/yourperfect/${id}`, itemData);
      return response.data;
    }
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/yourperfect/${id}`);
    return response.data;
  },
};

// SidebarCard API
export const sidebarcardAPI = {
  getAll: async () => {
    const response = await api.get('/api/sidebarcard');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/sidebarcard/${id}`);
    return response.data;
  },
  
  create: async (itemData) => {
    // Check if itemData contains a file (FormData)
    if (itemData instanceof FormData) {
      const response = await api.post('/api/sidebarcard', itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.post('/api/sidebarcard', itemData);
      return response.data;
    }
  },
  
  update: async (id, itemData) => {
    // Check if itemData contains a file (FormData)
    if (itemData instanceof FormData) {
      const response = await api.put(`/api/sidebarcard/${id}`, itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Fallback for URL-based images
      const response = await api.put(`/api/sidebarcard/${id}`, itemData);
      return response.data;
    }
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/sidebarcard/${id}`);
    return response.data;
  },
};

// DAMAC API
export const damacAPI = {
  getAll: async () => {
    const response = await api.get('/api/damac');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/damac/${id}`);
    return response.data;
  },
  
  create: async (itemData) => {
    const response = await api.post('/api/damac', itemData);
    return response.data;
  },
  
  update: async (id, itemData) => {
    const response = await api.put(`/api/damac/${id}`, itemData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/damac/${id}`);
    return response.data;
  },
};

// EmpoweringCommunities API
export const empoweringcommunitiesAPI = {
  getAll: async () => {
    const response = await api.get('/api/empoweringcommunities');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/empoweringcommunities/${id}`);
    return response.data;
  },
  
  create: async (itemData) => {
    const response = await api.post('/api/empoweringcommunities', itemData);
    return response.data;
  },
  
  update: async (id, itemData) => {
    const response = await api.put(`/api/empoweringcommunities/${id}`, itemData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/empoweringcommunities/${id}`);
    return response.data;
  },
};

export default api;
