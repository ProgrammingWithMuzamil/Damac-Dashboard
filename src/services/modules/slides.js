import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const slidesAPI = {
  getAll: async () => {
    const response = await axios_get_call(API_ENDPOINTS.SLIDES.LIST);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.SLIDES.DETAIL(id));
    return response.data;
  },

  create: async (slideData) => {
    const response = await axios_post_call(API_ENDPOINTS.SLIDES.LIST, slideData);
    return response.data;
  },

  update: async (id, slideData) => {
    const response = await axios_put_call(API_ENDPOINTS.SLIDES.DETAIL(id), slideData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.SLIDES.DETAIL(id));
    return response.data;
  },
};
