import { Router } from 'express';
import * as controller from '../controllers/users.controller.js';
// import { validate } from '../middleware/validate.js';
// import { createSchema, updateSchema } from './users.validators.js';

const router = Router();

router.get('/', controller.list);
router.post('/', /* validate(createSchema), */ controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', /* validate(updateSchema), */ controller.update);
router.delete('/:id', controller.remove);

export default router;