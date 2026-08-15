
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/reports/reports.service.js';
import { arrayToCsv, sendCsv } from '../utils/csv.js';

const report = (type) =>
  asyncHandler(async (req, res) => {
    const data = await service[type](req.query);
    if (req.query?.format === 'csv') {
      const rows = service.toExportRows(type, data);
      return sendCsv(res, `${type}-report.csv`, arrayToCsv(rows));
    }
    res.json(data);
  });

export const dashboard = report('dashboard');
export const projects = report('projects');
export const machinery = report('machinery');
export const labour = report('labour');
export const quotations = report('quotations');
export const crm = report('crm');
export const payments = report('payments');