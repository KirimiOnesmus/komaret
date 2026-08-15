import { ROLES } from './roles';

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


export const ADMIN_PATHS = Object.freeze({
  LOGIN: '/admin/login',
  FORGOT_PASSWORD: '/admin/forgot-password',
  RESET_PASSWORD: '/admin/reset-password',

  DASHBOARD: '/admin',

  PROJECTS: '/admin/projects',
  PROJECT_DETAILS: '/admin/projects/:id',
  PROJECT_CREATE: '/admin/projects/new',
  PROJECT_EDIT: '/admin/projects/:id/edit',

  SERVICES: '/admin/services',
  SERVICE_CREATE: '/admin/services/new',
  SERVICE_DETAILS: '/admin/services/:id',
  SERVICE_EDIT: '/admin/services/:id/edit',

  MACHINERY: '/admin/services/machinery',
  MACHINERY_CREATE: '/admin/services/machinery/new',
  MACHINERY_DETAILS: '/admin/services/machinery/:id',
  MACHINERY_EDIT: '/admin/services/machinery/:id/edit',

  LABOUR: '/admin/services/labour',
  LABOUR_CREATE: '/admin/services/labour/new',
  LABOUR_EDIT: '/admin/services/labour/:id/edit',

  QUOTATIONS: '/admin/quotations',
  QUOTATION_DETAILS: '/admin/quotations/:id',
  QUOTATION_CREATE: '/admin/quotations/new',
  QUOTATION_EDIT: '/admin/quotations/:id/edit',

  CRM: '/admin/crm',
  SERVICE_REQUESTS: '/admin/service-requests',
  COMMUNICATIONS: '/admin/communications',
  PAYMENTS: '/admin/payments',

  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
});


export const ADMIN_ROUTE_PATHS = Object.freeze({
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',

  DASHBOARD: '',

  PROJECTS: 'projects',
  PROJECT_DETAILS: 'projects/:id',
  PROJECT_CREATE: 'projects/new',
  PROJECT_EDIT: 'projects/:id/edit',

  SERVICES: 'services',
  SERVICE_CREATE: 'services/new',
  SERVICE_DETAILS: 'services/:id',
  SERVICE_EDIT: 'services/:id/edit',
  MACHINERY: 'services/machinery',
  MACHINERY_CREATE: 'services/machinery/new',
  MACHINERY_DETAILS: 'services/machinery/:id',
  MACHINERY_EDIT: 'services/machinery/:id/edit',
  LABOUR: 'services/labour',
  LABOUR_CREATE: 'services/labour/new',
  LABOUR_EDIT: 'services/labour/:id/edit',

  QUOTATIONS: 'quotations',
  QUOTATION_DETAILS: 'quotations/:id',
  QUOTATION_CREATE: 'quotations/new',
  QUOTATION_EDIT: 'quotations/:id/edit',

  CRM: 'crm',
  SERVICE_REQUESTS: 'service-requests',
  COMMUNICATIONS: 'communications',
  PAYMENTS: 'payments',
  REPORTS: 'reports',
  SETTINGS: 'settings',
});

export const ADMIN_ROUTE_ROLES = Object.freeze({
  [ADMIN_PATHS.REPORTS]: [ROLES.OWNER, ROLES.ADMIN],
  [ADMIN_PATHS.SETTINGS]: [ROLES.OWNER, ROLES.ADMIN],
});