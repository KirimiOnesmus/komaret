import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/interiorDesign/interiorDesign.service.js';

export const list = asyncHandler(async (req, res) => {
  const data = await service.list(req.query);
  res.json(data);
});

export const getById = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);
  res.json(data);
});

export const create = asyncHandler(async (req, res) => {
  const data = await service.create(req.body, req.user);
  res.status(201).json(data);
});

export const update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body, req.user);
  res.json(data);
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.user);
  res.status(204).end();
});