
export const ROLES = Object.freeze({
  OWNER: 'OWNER', // superset — registers admins/managers, records payments
  ADMIN: 'ADMIN', // full back-office access
});

export const QUOTATION_STATUS = Object.freeze({
  DRAFT: 'draft',
  SENT: 'sent',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  CONVERTED: 'converted',
});

export const MACHINERY_STATUS = Object.freeze({
  AVAILABLE: 'available',
  HIRED: 'hired',
  UNDER_MAINTENANCE: 'under_maintenance',
  RESERVED: 'reserved',
  OUT_OF_SERVICE: 'out_of_service',
});

export const LEAD_STATUS = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  SITE_VISIT: 'site_visit',
  QUOTED: 'quoted',
  WON: 'won',
  LOST: 'lost',
});
