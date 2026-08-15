// Service catalogue — controller (services + rate card).
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/catalog/catalog.service.js';

export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body, req.user)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.body, req.user)));
export const remove = asyncHandler(async (req, res) => { await service.remove(req.params.id, req.user); res.status(204).end(); });

export const listRates = asyncHandler(async (req, res) => res.json(await service.listRates(req.params.id)));
export const addRate = asyncHandler(async (req, res) => res.status(201).json(await service.addRate(req.params.id, req.body)));
export const updateRate = asyncHandler(async (req, res) => res.json(await service.updateRate(req.params.rateId, req.body)));
export const removeRate = asyncHandler(async (req, res) => { await service.removeRate(req.params.rateId); res.status(204).end(); });

export const setImage = asyncHandler(async (req, res) => res.json(await service.setImage(req.params.id, req.file)));
export const removeImage = asyncHandler(async (req, res) => res.json(await service.removeImage(req.params.id)));
