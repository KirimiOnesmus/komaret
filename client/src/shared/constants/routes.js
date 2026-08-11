import { ROLES } from './roles';

/**
 * Public marketing-site paths.
 */
export const PUBLIC_PATHS = Object.freeze({
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  SERVICE_DETAILS: '/services/:slug',
  SERVICE_REQUEST: '/services/:slug/request',
  ESTIMATE_RESULT: '/services/:slug/estimate',
  REQUEST_CONFIRMATION: '/services/:slug/confirmation',
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:slug',
  WHY_CHOOSE_US: '/why-choose-us',
  NEWS: '/news',
  NEWS_DETAILS: '/news/:slug',
  CONTACT: '/contact',
  QUOTE: '/quote',
});

/**
 * Admin (back-office) paths. All are mounted under /admin and, except
 * for the auth pages, sit behind AdminRoutes' authentication guard.
 */
export const ADMIN_PATHS = Object.freeze({
  LOGIN: '/admin/login',
  FORGOT_PASSWORD: '/admin/forgot-password',
  RESET_PASSWORD: '/admin/reset-password',

  DASHBOARD: '/admin',

  PROJECTS: '/admin/projects',
  PROJECT_DETAILS: '/admin/projects/:id',
  PROJECT_CREATE: '/admin/projects/new',
  PROJECT_EDIT: '/admin/projects/:id/edit',

  MACHINERY: '/admin/machinery',
  MACHINERY_DETAILS: '/admin/machinery/:id',

  LABOUR: '/admin/labour',

  INTERIOR_DESIGN: '/admin/interior-design',
  RENOVATIONS: '/admin/renovations',
  REAL_ESTATE: '/admin/real-estate',

  QUOTATIONS: '/admin/quotations',
  QUOTATION_DETAILS: '/admin/quotations/:id',
  QUOTATION_CREATE: '/admin/quotations/new',
  QUOTATION_EDIT: '/admin/quotations/:id/edit',

  CRM: '/admin/crm',
  SERVICE_REQUESTS: '/admin/service-requests',
  COMMUNICATIONS: '/admin/communications',
  DOCUMENTS: '/admin/documents',

  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
});

// Admin routes with no entry here are open to any authenticated admin
// user; this list only drives which nav items/routes are further
// restricted by role. The backend enforces the real RBAC boundary.
export const ADMIN_ROUTE_ROLES = Object.freeze({
  [ADMIN_PATHS.REPORTS]: [ROLES.ADMIN, ROLES.MANAGER],
  [ADMIN_PATHS.SETTINGS]: [ROLES.ADMIN],
});
