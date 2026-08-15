// Operational payment tracking — controller.
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/payments/payments.service.js';
export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body, req.user)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.body)));
export const remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).end(); });
export const receipt = asyncHandler(async (req, res) => {
  const { buffer, filename } = await service.renderReceipt(req.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.send(buffer);
});
