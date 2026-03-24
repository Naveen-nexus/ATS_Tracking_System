import api from '../utils/api';

export const applicationService = {
  // Apply for a job
  applyJob: async (jobId) => {
    return await api.post('/applications', { jobId });
  },

  // Get current candidate's applications
  getMyApplications: async () => {
    return await api.get('/applications/mine');
  },

  // Get recruiter's applications
  getRecruiterApplications: async () => {
    return await api.get('/applications/recruiter');
  },

  // Get single application by ID
  getApplicationById: async (id) => {
    return await api.get(`/applications/${id}`);
  },

  // Update status (recruiter)
  updateStatus: async (applicationId, status, notes) => {
    return await api.put(`/applications/${applicationId}/status`, { status, notes });
  }
};
