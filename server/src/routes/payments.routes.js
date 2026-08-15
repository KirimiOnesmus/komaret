
import { Router } from 'express';
import * as controller from '../controllers/payments.controller.js';
const router = Router();
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.get('/:id/receipt', controller.receipt);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
export default router;
