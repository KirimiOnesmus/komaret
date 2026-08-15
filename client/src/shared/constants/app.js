export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});


export const PROJECT_STATUSES = Object.freeze([
  'PENDING',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
]);

export const PROJECT_STATUS_LABELS = Object.freeze({
  PENDING: 'Pending',
  ACTIVE: 'Active',
  ON_HOLD: 'On hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
});


export const MACHINERY_STATUSES = Object.freeze([
  'AVAILABLE',
  'RESERVED',
  'HIRED',
  'IN_USE',
  'MAINTENANCE',
  'UNAVAILABLE',
]);

export const MACHINERY_STATUS_LABELS = Object.freeze({
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  HIRED: 'Hired',
  IN_USE: 'In use',
  MAINTENANCE: 'Maintenance',
  UNAVAILABLE: 'Unavailable',
});


export const LABOUR_ROLES = Object.freeze([
  'SITE_MANAGER',
  'FOREMAN',
  'PLUMBER',
  'ELECTRICIAN',
  'MASON',
  'CARPENTER',
  'PAINTER',
  'GENERAL',
  'OTHER',
]);

export const LABOUR_ROLE_LABELS = Object.freeze({
  SITE_MANAGER: 'Site manager',
  FOREMAN: 'Foreman',
  PLUMBER: 'Plumber',
  ELECTRICIAN: 'Electrician',
  MASON: 'Mason',
  CARPENTER: 'Carpenter',
  PAINTER: 'Painter',
  GENERAL: 'General worker',
  OTHER: 'Other',
});


export const LABOUR_STATUSES = Object.freeze(['AVAILABLE', 'ASSIGNED', 'UNAVAILABLE', 'INACTIVE']);

export const LABOUR_STATUS_LABELS = Object.freeze({
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  UNAVAILABLE: 'Unavailable',
  INACTIVE: 'Inactive',
});


export const QUOTATION_STATUSES = Object.freeze([
  'DRAFT',
  'SENT',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
  'CONVERTED',
]);

export const QUOTATION_STATUS_LABELS = Object.freeze({
  DRAFT: 'Draft',
  SENT: 'Sent',
  UNDER_REVIEW: 'Under review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  CONVERTED: 'Converted',
});


export const DISCOUNT_TYPES = Object.freeze(['NONE', 'PERCENT', 'FIXED']);
export const DISCOUNT_TYPE_LABELS = Object.freeze({
  NONE: 'No discount',
  PERCENT: 'Percentage (%)',
  FIXED: 'Fixed amount',
});

export const DEFAULT_TAX_RATE_PCT = 16;

export const SERVICE_REQUEST_STATUSES = Object.freeze([
  'new',
  'reviewing',
  'quoted',
  'converted',
  'closed',
]);

export const CURRENCY = 'KES';

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_UPLOAD_MIME_TYPES = Object.freeze([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
]);