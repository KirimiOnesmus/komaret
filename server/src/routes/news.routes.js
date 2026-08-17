import { Router } from 'express';
import * as controller from '../controllers/news.controller.js';
import { imageUpload } from '../middleware/upload.js';

const router = Router();

// Articles (news & insights)
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

// Single article image
router.post('/:id/image', imageUpload.single('image'), controller.setImage);
router.delete('/:id/image', controller.removeImage);

export default router;
