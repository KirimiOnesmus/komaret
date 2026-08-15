import api from './api';

const REPORT_ENDPOINTS = {
  dashboard: '/admin/reports/dashboard',
  projects: '/admin/reports/projects',
  machinery: '/admin/reports/machinery',
  labour: '/admin/reports/labour',
  quotations: '/admin/reports/quotations',
  crm: '/admin/reports/crm',
  payments: '/admin/reports/payments',
};

const reportsService = {
  get: (type, params = {}) => {
    const url = REPORT_ENDPOINTS[type];
    if (!url) return Promise.reject(new Error(`Unknown report type: ${type}`));
    return api.get(url, { params });
  },

  
  exportCsv: async (type, params = {}) => {
    const url = REPORT_ENDPOINTS[type];
    if (!url) throw new Error(`Unknown report type: ${type}`);
    const response = await api.get(url, {
      params: { ...params, format: 'csv' },
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${type}-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  },
};

export default reportsService;