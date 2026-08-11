import api from './api';

const publicService = {
  getServices: (params = {}) => api.get('/public/services', { params }),
  getServiceBySlug: (slug) => api.get(`/public/services/${encodeURIComponent(slug)}`),

  getProjects: (params = {}) => api.get('/public/projects', { params }),
  getProjectBySlug: (slug) => api.get(`/public/projects/${encodeURIComponent(slug)}`),

  getNews: (params = {}) => api.get('/public/news', { params }),
  getNewsBySlug: (slug) => api.get(`/public/news/${encodeURIComponent(slug)}`),


  submitContactForm: (payload) => api.post('/public/contact', payload),
};

export default publicService;
