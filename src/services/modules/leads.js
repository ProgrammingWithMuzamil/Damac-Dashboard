import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const leadsAPI = {
  // Admin endpoints
  getAll: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.LEADS.LIST, params);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.LEADS.DETAIL(id));
    return response.data;
  },

  create: async (leadData) => {
    const response = await axios_post_call(API_ENDPOINTS.LEADS.LIST, leadData);
    return response.data;
  },

  update: async (id, leadData) => {
    const response = await axios_put_call(API_ENDPOINTS.LEADS.DETAIL(id), leadData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.LEADS.DETAIL(id));
    return response.data;
  },

  // Agent endpoints
  getMyLeads: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.LEADS.LIST, params);
    return response.data;
  },

  updateMyLead: async (id, leadData) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.LEADS.DETAIL(id), leadData);
    return response.data;
  },

  // Public endpoints
  submitLead: async (leadData) => {
    const response = await axios_post_call(API_ENDPOINTS.PUBLIC.LEADS.LIST, leadData);
    return response.data;
  },
};
