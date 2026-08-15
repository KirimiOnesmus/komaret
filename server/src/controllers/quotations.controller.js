// 3.7 Quotations — controller.
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/quotations/quotations.service.js';

export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body, req.user)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.body)));
export const remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).end(); });
export const updateStatus = asyncHandler(async (req, res) => res.json(await service.updateStatus(req.params.id, req.body.status)));
export const createFromServiceRequest = asyncHandler(async (req, res) => res.status(201).json(await service.createFromServiceRequest(req.params.serviceRequestId, req.user)));
export const draft = asyncHandler(async (req, res) => res.json(await service.draftItems(req.body)));

export const addItem = asyncHandler(async (req, res) => res.status(201).json(await service.addItem(req.params.id, req.body)));
export const updateItem = asyncHandler(async (req, res) => res.json(await service.updateItem(req.params.itemId, req.body)));
export const removeItem = asyncHandler(async (req, res) => res.json(await service.removeItem(req.params.itemId)));

export const downloadPdf = asyncHandler(async (req, res) => {
  const { stream, filename } = await service.renderPdf(req.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  stream.pipe(res);
});
