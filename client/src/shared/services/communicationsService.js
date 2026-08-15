import api from './api';


const communicationsService = {
  list: (params = {}) => api.get('/admin/communications', { params }),
  dispatch: () => api.post('/admin/communications/dispatch'),
  retry: (id) => api.post(`/admin/communications/${encodeURIComponent(id)}/retry`),

  listContactMessages: (params = {}) => api.get('/admin/communications/contact-messages', { params }),
  markContactMessageHandled: (id, handled = true) =>
    api.patch(`/admin/communications/contact-messages/${encodeURIComponent(id)}`, { handled }),
  setContactMessagePublished: (id, publish = true) =>
    api.patch(`/admin/communications/contact-messages/${encodeURIComponent(id)}/publish`, { publish }),
  replyToContactMessage: (id, payload) =>
    api.post(`/admin/communications/contact-messages/${encodeURIComponent(id)}/reply`, payload),
};

export default communicationsService;