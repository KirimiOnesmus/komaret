import api from './api';

/**
 * Handles the public "request a service / get a quote" flow, and the
 * admin-side management of submitted requests.
 *
 * Security notes:
 * - `submit` is public and unauthenticated: the backend must validate
 *   every field server-side, cap payload size, rate-limit by IP, and
 *   never trust a client-supplied price estimate as final pricing.
 * - `list`/`updateStatus` are admin-only: the server must enforce
 *   authentication + RBAC on these regardless of what this client sends.
 */
const serviceRequestService = {
  /** Public: submit a new service/quote request. */
  submit: (payload) => api.post('/service-requests', payload),

  /** Public: fetch a rough estimate preview (advisory only — the real
   *  quote is produced by staff via the Quotations module). */
  getEstimate: (payload) => api.post('/service-requests/estimate', payload),

  /** Public: look up a submitted request's status by its confirmation
   *  reference (never by guessable sequential id). */
  getByReference: (reference) =>
    api.get(`/service-requests/reference/${encodeURIComponent(reference)}`),

  /** Admin: list/filter submitted requests. */
  list: (params = {}) => api.get('/admin/service-requests', { params }),

  /** Admin: view a single request. */
  getById: (id) => api.get(`/admin/service-requests/${encodeURIComponent(id)}`),

  /** Admin: update triage status (new/reviewing/quoted/converted/closed). */
  updateStatus: (id, status) =>
    api.patch(`/admin/service-requests/${encodeURIComponent(id)}/status`, { status }),
};

export default serviceRequestService;
