import express from 'express';

import {
  addIntegration,
} from '../controllers/integration.controller.js';

const router = express.Router();

router.post('/integration', addIntegration)


export default router;
