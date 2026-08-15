
import { Router } from 'express';
import * as controller from '../controllers/reports.controller.js';
const router = Router();
router.get('/dashboard', controller.dashboard);
router.get('/projects', controller.projects);
router.get('/machinery', controller.machinery);
router.get('/labour', controller.labour);
router.get('/quotations', controller.quotations);
router.get('/crm', controller.crm);
router.get('/payments', controller.payments);
export default router;
