
import { Router } from 'express';
import * as controller from '../controllers/invoicing.controller.js';

const router = Router();
router.get('/', controller.list);
router.post('/', controller.create); 
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/issue', controller.issue);
router.post('/:id/email', controller.emailInvoice); 
router.get('/:id/pdf', controller.invoicePdf);    
router.get('/:id/receipt', controller.receiptPdf);   

export default router;
