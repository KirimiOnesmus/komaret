// Invoices — controller.
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/invoicing/invoicing.service.js';

export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body, req.user)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.body)));
export const remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).end(); });
export const issue = asyncHandler(async (req, res) => res.json(await service.issue(req.params.id)));
export const emailInvoice = asyncHandler(async (req, res) => res.json(await service.emailInvoice(req.params.id)));

const sendPdf = (res, buffer, filename, disposition = 'inline') => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);
  res.send(buffer);
};
export const invoicePdf = asyncHandler(async (req, res) => { const { buffer, filename } = await service.invoicePdf(req.params.id); sendPdf(res, buffer, filename); });
export const receiptPdf = asyncHandler(async (req, res) => { const { buffer, filename } = await service.receiptPdf(req.params.id); sendPdf(res, buffer, filename); });
