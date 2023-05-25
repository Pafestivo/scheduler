import express from 'express';

import {
  addCalendar,
  getCalendars
} from '../controllers/calendar.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('', protect, addCalendar);
router.get('/:userHash', getCalendars)

export default router;
