import express from 'express';

import { getAppointments, getCalendars, postAppointment } from '../controllers/googleCalendar.controller.js';

const router = express.Router();

router.get('/googleAppointments/:userHash', getAppointments);
router.get('/googleCalendars/:userHash', getCalendars);
router.post('/googleAppointments/:userHash', postAppointment);

export default router;
