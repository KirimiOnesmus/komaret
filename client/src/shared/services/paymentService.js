import api from './api';

const RESOURCE = '/admin/payments';

const paymentService = {
  list: (params = {}) => api.get(RESOURCE, { params }),
  getById: (id) => api.get(`${RESOURCE}/${encodeURIComponent(id)}`),
  create: (payload) => api.post(RESOURCE, payload),
  remove: (id) => api.delete(`${RESOURCE}/${encodeURIComponent(id)}`),

  // Printable receipt PDF (opens inline for print).
  receipt: (id) => api.get(`${RESOURCE}/${encodeURIComponent(id)}/receipt`, { responseType: 'blob' }),
};

export default paymentService;
