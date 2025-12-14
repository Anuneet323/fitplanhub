import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const authService = {
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export default authService;
