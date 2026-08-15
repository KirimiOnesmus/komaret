import api from './api';

const publicService = {
  getCategories: (params = {}) => api.get('/public/categories', { params }),
  getCategoryBySlug: (slug) => api.get(`/public/categories/${encodeURIComponent(slug)}`),

  getServices: (params = {}) => api.get('/public/services', { params }),
  getServiceBySlug: (slug) => api.get(`/public/services/${encodeURIComponent(slug)}`),

  getProjects: (params = {}) => api.get('/public/projects', { params }),
  getProjectBySlug: (slug) => api.get(`/public/projects/${encodeURIComponent(slug)}`),

  getNews: (params = {}) => api.get('/public/news', { params }),
  getNewsBySlug: (slug) => api.get(`/public/news/${encodeURIComponent(slug)}`),

  getTestimonials: () => api.get('/public/testimonials'),


  submitContactForm: (payload) => api.post('/public/contact', payload),
};

export default publicService;
