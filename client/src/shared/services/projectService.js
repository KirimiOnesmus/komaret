import api from './api';

const RESOURCE = '/admin/projects';


const MULTIPART = { headers: { 'Content-Type': undefined } };

const projectService = {
  list: (params = {}) => api.get(RESOURCE, { params }),
  getById: (id) => api.get(`${RESOURCE}/${encodeURIComponent(id)}`),
  create: (payload) => api.post(RESOURCE, payload),
  update: (id, payload) => api.patch(`${RESOURCE}/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`${RESOURCE}/${encodeURIComponent(id)}`),

  // Showcase images
  uploadImages: (id, formData) => api.post(`${RESOURCE}/${encodeURIComponent(id)}/images`, formData, MULTIPART),
  uploadCover: (id, formData) => api.post(`${RESOURCE}/${encodeURIComponent(id)}/cover`, formData, MULTIPART),
  updateImage: (id, imageId, payload) =>
    api.patch(`${RESOURCE}/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`, payload),
  deleteImage: (id, imageId) =>
    api.delete(`${RESOURCE}/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`),
};

export default projectService;