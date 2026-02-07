import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const damacAPI = {
  getAll: async () => {
    const response = await axios_get_call(API_ENDPOINTS.DAMAC.LIST);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.DAMAC.DETAIL(id));
    return response.data;
  },

  create: async (itemData) => {
    const response = await axios_post_call(API_ENDPOINTS.DAMAC.LIST, itemData);
    return response.data;
  },

  update: async (id, itemData) => {
    const response = await axios_put_call(API_ENDPOINTS.DAMAC.DETAIL(id), itemData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.DAMAC.DETAIL(id));
    return response.data;
  },
};
