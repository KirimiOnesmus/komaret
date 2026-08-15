
import { Router } from 'express';
import * as controller from '../controllers/crm.controller.js';

const router = Router();

// Leads
router.get('/leads', controller.listLeads);
router.post('/leads', controller.createLead);
router.get('/leads/:id', controller.getLead);
router.patch('/leads/:id', controller.updateLead);
router.delete('/leads/:id', controller.removeLead);
router.post('/leads/:id/convert', controller.convertLead); // lead → client

// Clients
router.get('/clients', controller.listClients);
router.post('/clients', controller.createClient);
router.get('/clients/:id', controller.getClient);
router.patch('/clients/:id', controller.updateClient);
router.delete('/clients/:id', controller.removeClient);

// Follow-ups
router.get('/follow-ups', controller.listFollowUps);
router.post('/follow-ups', controller.createFollowUp);
router.patch('/follow-ups/:id', controller.updateFollowUp);
router.delete('/follow-ups/:id', controller.removeFollowUp);

export default router;
