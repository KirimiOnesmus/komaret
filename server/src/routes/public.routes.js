
import { Router } from 'express';
import * as controller from '../controllers/public.controller.js';
import { contactRateLimit } from '../middleware/rateLimit.js';

const router = Router();


router.get('/categories', controller.listCategories);
router.get('/categories/:slug', controller.getCategoryBySlug);

router.get('/services', controller.listServices);
router.get('/services/:slug', controller.getServiceBySlug);

// Projects / portfolio (public-safe: no private labour/financials)
router.get('/projects', controller.listProjects);
router.get('/projects/:id', controller.getProjectById);

// Machinery hire — public catalogue only (no availability/assignment internals)
router.get('/machinery', controller.listMachinery);
router.get('/machinery/:id', controller.getMachineryById);

// Contact / company information
router.get('/testimonials', controller.listTestimonials);
router.post('/contact', contactRateLimit, controller.submitContact);

export default router;
