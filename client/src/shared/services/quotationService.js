import api from './api';

const RESOURCE = '/admin/quotations';

const quotationService = {
  list: (params = {}) => api.get(RESOURCE, { params }),
  getById: (id) => api.get(`${RESOURCE}/${encodeURIComponent(id)}`),
  create: (payload) => api.post(RESOURCE, payload),
  update: (id, payload) => api.patch(`${RESOURCE}/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`${RESOURCE}/${encodeURIComponent(id)}`),

  /** Transition a quotation's status (new/reviewing/approved/converted/closed).*/
  updateStatus: (id, status) =>
    api.patch(`${RESOURCE}/${encodeURIComponent(id)}/status`, { status }),

  /** Convert an approved service request into a draft quotation. */
  createFromServiceRequest: (serviceRequestId) =>
    api.post(`${RESOURCE}/from-service-request/${encodeURIComponent(serviceRequestId)}`),
};

export default quotationService;
