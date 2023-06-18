import express from 'express';
import { protect } from '../middlewares/authHandler.js';

import {
  addIntegration,
  getAllUserIntegrations
} from '../controllers/integration.controller.js';

const router = express.Router();

router.post('/integration', addIntegration)
router.get('/integration/:userEmail', protect, getAllUserIntegrations)


export default router;
