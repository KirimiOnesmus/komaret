import { Router } from 'express';
import * as controller from '../controllers/projects.controller.js';
import { imageUpload } from '../middleware/upload.js';

const router = Router();

router.get('/', controller.list);
router.post('/', controller.create); 
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);


router.get('/:id/activities', controller.listActivities);
router.post('/:id/activities', controller.addActivity);


router.get('/:id/images', controller.listImages);
router.post('/:id/images', imageUpload.array('images', 12), controller.addImages);
router.post('/:id/cover', imageUpload.single('image'), controller.setCover);
router.patch('/:id/images/:imageId', controller.updateImage);
router.delete('/:id/images/:imageId', controller.removeImage);

router.post('/:id/machinery', controller.assignMachinery);
router.delete('/:id/machinery/:assignmentId', controller.releaseMachinery);
router.post('/:id/labour', controller.assignLabour);
router.get('/:id/payments', controller.paymentSummary); 
router.delete('/:id/labour/:assignmentId', controller.releaseLabour);

export default router;