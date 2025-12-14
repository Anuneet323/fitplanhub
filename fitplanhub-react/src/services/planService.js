import api from './api';

const planService = {
  getAllPlans: async () => {
    try {
      const response = await api.get('/plans');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/plans/${planId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await api.post('/plans', planData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/plans/${planId}`, planData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  deletePlan: async (planId) => {
    try {
      const response = await api.delete(`/plans/${planId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  subscribePlan: async (planId) => {
    try {
      const response = await api.post(`/subscriptions/${planId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  getUserSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  unsubscribePlan: async (planId) => {
    try {
      const response = await api.delete(`/subscriptions/${planId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }
};

export default planService;
