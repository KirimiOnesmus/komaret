// Service categories — READ-ONLY admin controller (fixed seeded set).
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/categories/categories.service.js';

export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
