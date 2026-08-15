
import { Router } from 'express';
import * as controller from '../controllers/catalog.controller.js';

const router = Router();

// Services
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

// Rate card
router.get('/:id/rates', controller.listRates);
router.post('/:id/rates', controller.addRate);
router.patch('/rates/:rateId', controller.updateRate);
router.delete('/rates/:rateId', controller.removeRate);

export default router;
