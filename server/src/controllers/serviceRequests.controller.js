import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/serviceRequests/serviceRequests.service.js';

export const submit = asyncHandler(async (req, res) => res.status(201).json(await service.submit(req.body)));
export const getEstimate = asyncHandler(async (req, res) => res.json(await service.getEstimate(req.body)));
export const getByReference = asyncHandler(async (req, res) => res.json(await service.getByReference(req.params.reference)));
export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const updateStatus = asyncHandler(async (req, res) => res.json(await service.updateStatus(req.params.id, req.body.status, req.user)));