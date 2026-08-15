// 3.8 CRM — controller (leads, clients, follow-ups).
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/crm/crm.service.js';

// Leads
export const listLeads = asyncHandler(async (req, res) => res.json(await service.listLeads(req.query)));
export const getLead = asyncHandler(async (req, res) => res.json(await service.getLead(req.params.id)));
export const createLead = asyncHandler(async (req, res) => res.status(201).json(await service.createLead(req.body)));
export const updateLead = asyncHandler(async (req, res) => res.json(await service.updateLead(req.params.id, req.body)));
export const removeLead = asyncHandler(async (req, res) => { await service.removeLead(req.params.id); res.status(204).end(); });
export const convertLead = asyncHandler(async (req, res) => res.status(201).json(await service.convertLead(req.params.id)));

// Clients
export const listClients = asyncHandler(async (req, res) => res.json(await service.listClients(req.query)));
export const getClient = asyncHandler(async (req, res) => res.json(await service.getClient(req.params.id)));
export const createClient = asyncHandler(async (req, res) => res.status(201).json(await service.createClient(req.body)));
export const updateClient = asyncHandler(async (req, res) => res.json(await service.updateClient(req.params.id, req.body)));
export const removeClient = asyncHandler(async (req, res) => { await service.removeClient(req.params.id); res.status(204).end(); });

// Follow-ups
export const listFollowUps = asyncHandler(async (req, res) => res.json(await service.listFollowUps(req.query)));
export const createFollowUp = asyncHandler(async (req, res) => res.status(201).json(await service.createFollowUp(req.body, req.user)));
export const updateFollowUp = asyncHandler(async (req, res) => res.json(await service.updateFollowUp(req.params.id, req.body)));
export const removeFollowUp = asyncHandler(async (req, res) => { await service.removeFollowUp(req.params.id); res.status(204).end(); });
