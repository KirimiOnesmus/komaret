
import { Router } from 'express';
import * as controller from '../controllers/quotations.controller.js';

const router = Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.post('/draft', controller.draft); 
router.post('/from-service-request/:serviceRequestId', controller.createFromServiceRequest);

// BOQ line items (granular)
router.post('/:id/items', controller.addItem);
router.patch('/items/:itemId', controller.updateItem);
router.delete('/items/:itemId', controller.removeItem);

router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.patch('/:id/status', controller.updateStatus);
router.get('/:id/pdf', controller.downloadPdf);
router.post('/:id/send', controller.sendToClient);
router.delete('/:id', controller.remove);

export default router;
