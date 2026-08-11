import api from './api';

/**
 * Admin-only project management client.*/
const RESOURCE = '/admin/projects';

const projectService = {
  list: (params = {}) => api.get(RESOURCE, { params }),
  getById: (id) => api.get(`${RESOURCE}/${encodeURIComponent(id)}`),
  create: (payload) => api.post(RESOURCE, payload),
  update: (id, payload) => api.patch(`${RESOURCE}/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`${RESOURCE}/${encodeURIComponent(id)}`),
};

export default projectService;
