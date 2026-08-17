
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/news/news.service.js';

export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.body)));
export const remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).end(); });

export const setImage = asyncHandler(async (req, res) => res.json(await service.setImage(req.params.id, req.file)));
export const removeImage = asyncHandler(async (req, res) => res.json(await service.removeImage(req.params.id)));
