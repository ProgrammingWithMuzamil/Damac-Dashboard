import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const agentDocumentsAPI = {
  getMyDocuments: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.DOCUMENTS, params);
    return response.data;
  },

  getMyDocumentById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.DOCUMENTS_DETAIL(id));
    return response.data;
  },

  uploadDocument: async (documentData) => {
    const response = await axios_post_call(API_ENDPOINTS.AGENT.DOCUMENTS, documentData);
    return response.data;
  },

  updateMyDocument: async (id, documentData) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.DOCUMENTS_DETAIL(id), documentData);
    return response.data;
  },

  deleteMyDocument: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.AGENT.DOCUMENTS_DETAIL(id));
    return response.data;
  },
};
