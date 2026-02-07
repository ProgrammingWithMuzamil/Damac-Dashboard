import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const agentsAPI = {
  // Admin endpoints
  getAll: async () => {
    const response = await axios_get_call(API_ENDPOINTS.AGENTS.LIST);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENTS.DETAIL(id));
    return response.data;
  },

  create: async (agentData) => {
    const response = await axios_post_call(API_ENDPOINTS.AGENTS.LIST, agentData);
    return response.data;
  },

  update: async (id, agentData) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENTS.DETAIL(id), agentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.AGENTS.DETAIL(id));
    return response.data;
  },

  // Public endpoints
  getPublicAgents: async () => {
    const response = await axios_get_call(API_ENDPOINTS.PUBLIC.AGENTS.LIST);
    return response.data;
  },

  getPublicAgentById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.PUBLIC.AGENTS.DETAIL(id));
    return response.data;
  },
};
