import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const agentPropertiesAPI = {
  getMyProperties: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.PROPERTIES, params);
    return response.data;
  },

  getMyPropertyById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.PROPERTIES_DETAIL(id));
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await axios_post_call(API_ENDPOINTS.AGENT.PROPERTIES, propertyData);
    return response.data;
  },

  updateMyProperty: async (id, propertyData) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.PROPERTIES_DETAIL(id), propertyData);
    return response.data;
  },

  deleteMyProperty: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.AGENT.PROPERTIES_DETAIL(id));
    return response.data;
  },
};
