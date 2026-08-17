// Public marketing site — controller. Serves only published, public-safe data.
import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/public/public.service.js';

export const listCategories = asyncHandler(async (req, res) => res.json(await service.listCategories(req.query)));
export const getCategoryBySlug = asyncHandler(async (req, res) => res.json(await service.getCategoryBySlug(req.params.slug)));
export const listServices = asyncHandler(async (req, res) => res.json(await service.listServices(req.query)));
export const getServiceBySlug = asyncHandler(async (req, res) => res.json(await service.getServiceBySlug(req.params.slug)));
export const listProjects = asyncHandler(async (req, res) => res.json(await service.listProjects(req.query)));
export const getProjectById = asyncHandler(async (req, res) => res.json(await service.getProjectById(req.params.id)));
export const listMachinery = asyncHandler(async (req, res) => res.json(await service.listMachinery(req.query)));
export const getMachineryById = asyncHandler(async (req, res) => res.json(await service.getMachineryById(req.params.id)));
export const listTestimonials = asyncHandler(async (req, res) => res.json(await service.listTestimonials()));

export const listNews = asyncHandler(async (req, res) => res.json(await service.listNews(req.query)));
export const getNewsBySlug = asyncHandler(async (req, res) => res.json(await service.getNewsBySlug(req.params.slug)));

export const submitContact = asyncHandler(async (req, res) => res.status(201).json(await service.submitContact(req.body)));
