import express from 'express';

import {
  addCalendar,
  getCalendars,
  getCalendar,
  deleteCalendar,
  updateCalendar
} from '../controllers/calendar.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('', protect, addCalendar);
router.get('/:userHash', protect, getCalendars);
router.get('/single/:hash', getCalendar);
router.delete('/:hash', protect ,deleteCalendar);
router.put('', protect, updateCalendar);


export default router;
