import express from 'express';
import { protect } from '../middlewares/authHandler.js';

import { addIntegration, getAllUserIntegrations } from '../controllers/integration.controller.js';

const router = express.Router();

router.post('/integration', addIntegration);
router.get('/integration/:userHash', protect, getAllUserIntegrations);

export default router;
