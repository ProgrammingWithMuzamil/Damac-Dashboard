import { axios_get_call, axios_post_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const agentReportsAPI = {
  getMyReports: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.REPORTS, params);
    return response.data;
  },

  getMyReportById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.REPORTS_DETAIL(id));
    return response.data;
  },

  generateReport: async (reportData) => {
    const response = await axios_post_call(API_ENDPOINTS.AGENT.REPORTS, reportData);
    return response.data;
  },

  downloadMyReport: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.REPORTS_DOWNLOAD(id));
    return response.data;
  },
};
