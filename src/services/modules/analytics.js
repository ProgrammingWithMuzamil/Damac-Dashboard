import { axios_get_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const analyticsAPI = {
  // Admin analytics endpoints
  getOverview: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.ANALYTICS.OVERVIEW, params);
    return response.data;
  },

  getAgentPerformance: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.ANALYTICS.AGENT_PERFORMANCE, params);
    return response.data;
  },

  // Agent analytics endpoints
  getMyAnalytics: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.ANALYTICS, params);
    return response.data;
  },
};
