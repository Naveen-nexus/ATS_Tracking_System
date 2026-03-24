import api from '../utils/api';

export const resumeService = {
  // Upload resume file
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    return await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get current candidate's resume
  getMyResume: async () => {
    return await api.get('/resumes/mine');
  }
};
