export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

export const PROJECT_STATUSES = Object.freeze([
  'planning',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled',
]);

export const QUOTATION_STATUSES = Object.freeze([
  'draft',
  'sent',
  'approved',
  'rejected',
  'expired',
]);

export const SERVICE_REQUEST_STATUSES = Object.freeze([
  'new',
  'reviewing',
  'quoted',
  'converted',
  'closed',
]);

export const CURRENCY = 'USD';

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_UPLOAD_MIME_TYPES = Object.freeze([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
]);
