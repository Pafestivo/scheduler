import express from 'express';

import {
  addCalendar,
  getCalendars,
  getCalendar,
  deleteCalendar,
  updateCalendar,
  getDeletedCalendars,
  getFullCalendar,
  updateReadFromCalendar
} from '../controllers/calendar.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('/calendars', protect, addCalendar);
router.get('/calendars/:userHash', protect, getCalendars);
router.get('/calendars/deleted/:userHash', protect, getDeletedCalendars);
router.get('/calendars/single/:hash', getCalendar);
router.get('/calendars/fullCalendar/:hash', protect, getFullCalendar);
router.delete('/calendars/:hash', protect ,deleteCalendar);
router.put('/calendars', protect, updateCalendar);
router.put('/calendars/readFrom', protect, updateReadFromCalendar);


export default router;
