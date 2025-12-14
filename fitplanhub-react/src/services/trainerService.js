import api from './api';

const trainerService = {
  getAllTrainers: async () => {
    try {
      const response = await api.get('/trainers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getFeed: async () => {
    try {
      const response = await api.get('/feed');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  followTrainer: async (trainerId) => {
    try {
      const response = await api.post(`/follow/${trainerId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  unfollowTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/follow/${trainerId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  getFollowedTrainers: async () => {
    try {
      const response = await api.get('/following');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default trainerService;
