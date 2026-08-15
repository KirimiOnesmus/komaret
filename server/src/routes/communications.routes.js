import { Router } from 'express';
import * as controller from '../controllers/communications.controller.js';
const router = Router();
router.get('/', controller.list);
router.post('/dispatch', controller.dispatch);
router.post('/:id/retry', controller.retry);


router.get('/contact-messages', controller.listContactMessages);
router.patch('/contact-messages/:id', controller.markContactMessageHandled);
router.patch('/contact-messages/:id/publish', controller.setContactMessagePublished);
router.post('/contact-messages/:id/reply', controller.replyToContactMessage);

export default router;