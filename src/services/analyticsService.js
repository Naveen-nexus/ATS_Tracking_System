import api from '../utils/api';

export const analyticsService = {
  // Get dashboard data
  getDashboardStats: async () => {
    return await api.get('/analytics/dashboard');
  },

  // Get job performance
  getJobPerformance: async () => {
    return await api.get('/analytics/jobs');
  }
};
