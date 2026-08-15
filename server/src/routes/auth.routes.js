import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';
import { authRateLimit } from '../middleware/rateLimit.js';
// import { validate } from '../middleware/validate.js';
// import * as schema from './auth.validators.js';

const router = Router();

// Public
router.post('/login', authRateLimit, controller.login);
router.post('/register', authenticate, authorize(ROLES.OWNER), controller.register);
router.post('/verify-email', controller.verifyEmail);
router.post('/password-reset/request', authRateLimit, controller.requestPasswordReset);
router.post('/password-reset/confirm', controller.confirmPasswordReset);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);

// Authenticated
router.get('/me', authenticate, controller.me);
router.post('/change-password', authenticate, controller.changePassword);

export default router;