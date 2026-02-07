import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const heroAPI = {
  // Admin hero endpoints
  getAll: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.HERO.LIST, params);
    return response.data;
  },

  get: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.HERO.DETAIL(id));
    return response.data;
  },

  create: async (data) => {
    const response = await axios_post_call(API_ENDPOINTS.HERO.LIST, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios_put_call(API_ENDPOINTS.HERO.DETAIL(id), data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.HERO.DETAIL(id));
    return response.data;
  },

  uploadMedia: async (id, formData) => {
    const response = await axios_put_call(API_ENDPOINTS.HERO.DETAIL(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Public hero endpoint
  getPublicHero: async () => {
    const response = await axios_get_call(API_ENDPOINTS.PUBLIC.HERO);
    return response.data;
  },
};
