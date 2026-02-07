import { axios_get_call, axios_put_call, axios_post_call, axios_patch_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const agentLeadsAPI = {
  // Agent lead management endpoints
  getAll: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.LEADS.LIST, params);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.LEADS.DETAIL(id));
    return response.data;
  },

  update: async (id, leadData) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.LEADS.DETAIL(id), leadData);
    return response.data;
  },

  // Update lead status
  updateStatus: async (id, status, note = '') => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.LEADS.DETAIL(id), {
      status,
      ...(note && { activity_note: note })
    });
    return response.data;
  },

  // Add activity note
  addNote: async (id, note) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.LEADS.DETAIL(id), {
      activity_note: note
    });
    return response.data;
  },

  // Revenue and Deal management endpoints
  getRevenueStats: async () => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.REVENUE.STATS);
    return response.data;
  },

  // Admin Deal management
  createDeal: async (dealData) => {
    const response = await axios_post_call(API_ENDPOINTS.ADMIN.DEALS.CREATE, dealData);
    return response.data;
  },

  updateDeal: async (id, dealData) => {
    const response = await axios_patch_call(API_ENDPOINTS.ADMIN.DEALS.DETAIL(id), dealData);
    return response.data;
  },

  deleteDeal: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.ADMIN.DEALS.DETAIL(id));
    return response.data;
  },

  getDeals: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.ADMIN.DEALS.LIST, params);
    return response.data;
  },

  getDealById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.ADMIN.DEALS.DETAIL(id));
    return response.data;
  },
};
