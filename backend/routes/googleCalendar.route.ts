import express from 'express';

import {
  getAppointments,
  getCalendars
} from '../controllers/googleCalendar.controller.js';

const router = express.Router();

router.get('/googleAppointments/:userEmail', getAppointments);
router.get('/googleCalendars/:userEmail', getCalendars);

export default router;
