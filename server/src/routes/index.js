
import { Router } from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import serviceRequestRoutes from './serviceRequests.routes.js';

import catalogRoutes from './catalog.routes.js';
import categoryRoutes from './categories.routes.js';
import projectRoutes from './projects.routes.js';
import quotationRoutes from './quotations.routes.js';
import machineryRoutes from './machinery.routes.js';
import labourRoutes from './labour.routes.js';
import crmRoutes from './crm.routes.js';
import reportRoutes from './reports.routes.js';
import settingRoutes from './settings.routes.js';
import paymentRoutes from './payments.routes.js';
import invoiceRoutes from './invoicing.routes.js';
import communicationRoutes from './communications.routes.js';
import auditRoutes from './audit.routes.js';
import userRoutes from './users.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// ---- Public surface ----
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/service-requests', serviceRequestRoutes.publicRouter);

// ---- Admin surface (owner + admin only) ----
const admin = Router();
admin.use(authenticate, authorize(ROLES.OWNER, ROLES.ADMIN));

admin.use('/categories', categoryRoutes);
admin.use('/services', catalogRoutes);
admin.use('/service-requests', serviceRequestRoutes.adminRouter);
admin.use('/projects', projectRoutes);
admin.use('/quotations', quotationRoutes);
admin.use('/machinery', machineryRoutes);
admin.use('/labour', labourRoutes);
admin.use('/crm', crmRoutes);
admin.use('/reports', reportRoutes);
admin.use('/settings', settingRoutes);
admin.use('/payments', paymentRoutes);
admin.use('/invoices', invoiceRoutes);
admin.use('/communications', communicationRoutes);
admin.use('/audit', auditRoutes);
admin.use('/users', userRoutes);

router.use('/admin', admin);

export default router;
