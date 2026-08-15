import { Router } from 'express';
import * as controller from '../controllers/documents.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', controller.list);
router.post('/', upload.single('file'), controller.create); // multipart
router.get('/:id', controller.getById);
router.get('/:id/download', controller.download);
router.delete('/:id', controller.remove);

export default router;