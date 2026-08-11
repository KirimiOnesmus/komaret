import api from './api';

/**
 * Admin-only CRM client covering leads, clients, and follow-ups.
 */
const crmService = {
  // Leads
  listLeads: (params = {}) => api.get('/admin/crm/leads', { params }),
  getLeadById: (id) => api.get(`/admin/crm/leads/${encodeURIComponent(id)}`),
  createLead: (payload) => api.post('/admin/crm/leads', payload),
  updateLead: (id, payload) => api.patch(`/admin/crm/leads/${encodeURIComponent(id)}`, payload),
  removeLead: (id) => api.delete(`/admin/crm/leads/${encodeURIComponent(id)}`),

  // Clients
  listClients: (params = {}) => api.get('/admin/crm/clients', { params }),
  getClientById: (id) => api.get(`/admin/crm/clients/${encodeURIComponent(id)}`),
  createClient: (payload) => api.post('/admin/crm/clients', payload),
  updateClient: (id, payload) => api.patch(`/admin/crm/clients/${encodeURIComponent(id)}`, payload),
  removeClient: (id) => api.delete(`/admin/crm/clients/${encodeURIComponent(id)}`),

  // Follow-ups
  listFollowUps: (params = {}) => api.get('/admin/crm/follow-ups', { params }),
  createFollowUp: (payload) => api.post('/admin/crm/follow-ups', payload),
  updateFollowUp: (id, payload) =>
    api.patch(`/admin/crm/follow-ups/${encodeURIComponent(id)}`, payload),
  removeFollowUp: (id) => api.delete(`/admin/crm/follow-ups/${encodeURIComponent(id)}`),
};

export default crmService;
