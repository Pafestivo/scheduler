import express from 'express';

import {
  HandleGoogleWebhook
} from '../controllers/webhooks.controller.js';

const router = express.Router();

router.post('/googleCalendar', HandleGoogleWebhook);

export default router;
