import { axios_get_call, axios_put_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const cmssettingsAPI = {
  get: async () => {
    const response = await axios_get_call(API_ENDPOINTS.CMS_SETTINGS.LIST);
    return response.data;
  },

  getAll: async () => {
    const response = await axios_get_call(API_ENDPOINTS.CMS_SETTINGS.LIST);
    return response.data;
  },

  update: async (settingsData) => {
    const response = await axios_put_call(API_ENDPOINTS.CMS_SETTINGS.DETAIL(1), settingsData);
    return response.data;
  },
};
