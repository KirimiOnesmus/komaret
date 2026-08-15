
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/communications/communications.service.js';
export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const dispatch = asyncHandler(async (req, res) => res.json(await service.dispatch()));
export const retry = asyncHandler(async (req, res) => res.json(await service.retry(req.params.id)));

export const listContactMessages = asyncHandler(async (req, res) => res.json(await service.listContactMessages(req.query)));
export const markContactMessageHandled = asyncHandler(async (req, res) =>
  res.json(await service.markContactMessageHandled(req.params.id, req.body?.handled ?? true)),
);
export const setContactMessagePublished = asyncHandler(async (req, res) =>
  res.json(await service.setContactMessagePublished(req.params.id, req.body?.publish ?? true)),
);
export const replyToContactMessage = asyncHandler(async (req, res) =>
  res.status(201).json(await service.replyToContactMessage(req.params.id, req.body)),
);