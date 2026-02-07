import { axios_get_call, axios_post_call, axios_put_call, axios_delete_call } from '../http';
import { API_ENDPOINTS } from '../ApiEndpoints';

export const agentAppointmentsAPI = {
  getMyAppointments: async (params = {}) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.APPOINTMENTS, params);
    return response.data;
  },

  getMyAppointmentById: async (id) => {
    const response = await axios_get_call(API_ENDPOINTS.AGENT.APPOINTMENTS_DETAIL(id));
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await axios_post_call(API_ENDPOINTS.AGENT.APPOINTMENTS, appointmentData);
    return response.data;
  },

  updateMyAppointment: async (id, appointmentData) => {
    const response = await axios_put_call(API_ENDPOINTS.AGENT.APPOINTMENTS_DETAIL(id), appointmentData);
    return response.data;
  },

  deleteMyAppointment: async (id) => {
    const response = await axios_delete_call(API_ENDPOINTS.AGENT.APPOINTMENTS_DETAIL(id));
    return response.data;
  },
};
