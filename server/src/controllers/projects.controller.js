
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/projects/projects.service.js';

export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const getById = asyncHandler(async (req, res) => res.json(await service.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body, req.user)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.body, req.user)));
export const remove = asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).end(); });
export const listActivities = asyncHandler(async (req, res) => res.json(await service.listActivities(req.params.id, req.query)));
export const addActivity = asyncHandler(async (req, res) => res.status(201).json(await service.addActivity(req.params.id, req.body, req.user)));

export const assignMachinery = asyncHandler(async (req, res) => res.status(201).json(await service.assignMachinery(req.params.id, req.body, req.user)));
export const releaseMachinery = asyncHandler(async (req, res) => res.json(await service.releaseMachinery(req.params.id, req.params.assignmentId)));
export const assignLabour = asyncHandler(async (req, res) => res.status(201).json(await service.assignLabour(req.params.id, req.body, req.user)));
export const releaseLabour = asyncHandler(async (req, res) => res.json(await service.releaseLabour(req.params.id, req.params.assignmentId)));


import * as paymentService from '../services/payments/payments.service.js';
export const paymentSummary = asyncHandler(async (req, res) => res.json(await paymentService.projectSummary(req.params.id)));

import * as images from '../services/projects/projectImages.service.js';
export const listImages = asyncHandler(async (req, res) => res.json(await images.listImages(req.params.id)));
export const addImages = asyncHandler(async (req, res) => res.status(201).json(await images.addImages(req.params.id, req.files)));
export const setCover = asyncHandler(async (req, res) => res.status(201).json(await images.setCover(req.params.id, req.file)));
export const updateImage = asyncHandler(async (req, res) => res.json(await images.updateImage(req.params.id, req.params.imageId, req.body)));
export const removeImage = asyncHandler(async (req, res) => { await images.removeImage(req.params.id, req.params.imageId); res.status(204).end(); });