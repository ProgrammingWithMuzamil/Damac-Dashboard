import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const usersAPI = {
  getAll: async () => {
    const response = await axios_get_call(API_ENDPOINTS.USERS.LIST);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  },

  create: async (userData) => {
    const response = await axios_post_call(API_ENDPOINTS.USERS.LIST, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axios_put_call(API_ENDPOINTS.USERS.DETAIL(id), userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  },
};
