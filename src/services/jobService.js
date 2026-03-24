import api from '../utils/api';

export const jobService = {
  // Get all jobs with filters
  getAllJobs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('title', filters.search); // Map search to title
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.jobType && filters.jobType !== 'All') queryParams.append('jobType', filters.jobType);
    if (filters.page) queryParams.append('page', filters.page);
    queryParams.append('limit', 10);
    
    // Note: Backend might need update to support sort
    
    return api.get(`/jobs?${queryParams.toString()}`);
  },

  // Get job by ID
  getJobById: async (id) => {
    return await api.get(`/jobs/${id}`);
  },

  // Get matched jobs (protected)
  getMatchedJobs: async () => {
    return await api.get(`/jobs/match`);
  },

  // Create job (recruiter)
  createJob: async (jobData) => {
    return await api.post('/jobs', jobData);
  },

  // Get jobs posted by logged in recruiter
  getMyPostedJobs: async () => {
    return await api.get('/jobs/recruiter');
  },

  updateJob: async (id, data) => {
    return await api.put(`/jobs/${id}`, data);
  },

  deleteJob: async (id) => {
    return await api.delete(`/jobs/${id}`);
  },
  
  getSavedJobs: async () => {
    return await api.get('/jobs/saved'); // Returns array of Job objects
  },
  
  saveJob: async (id) => {
    return await api.post(`/jobs/${id}/save`);
  },
  
  unsaveJob: async (id) => {
    return await api.delete(`/jobs/${id}/save`);
  }
};
