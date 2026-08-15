import { Router } from 'express';
import * as controller from '../controllers/serviceRequests.controller.js';

// Public — no auth
export const publicRouter = Router();
publicRouter.post('/', controller.submit);
publicRouter.post('/estimate', controller.getEstimate);
publicRouter.get('/reference/:reference', controller.getByReference);

// Admin — behind authenticate + authorize
export const adminRouter = Router();
adminRouter.get('/', controller.list);
adminRouter.get('/:id', controller.getById);
adminRouter.patch('/:id/status', controller.updateStatus);

export default { publicRouter, adminRouter };