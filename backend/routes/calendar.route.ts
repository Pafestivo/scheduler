import express from 'express';

import {
  addCalendar
} from '../controllers/calendar.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('', protect, addCalendar);

export default router;
