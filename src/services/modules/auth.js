import { axios_post_call, axios_get_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const authAPI = {
  login: async (email, password) => {
    const response = await axios_post_call(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios_post_call(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axios_post_call(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  getProfile: async () => {
    const response = await axios_get_call(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
};
