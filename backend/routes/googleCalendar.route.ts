import express from 'express';

import { getAppointments, getCalendars, postAppointment, deleteAppointment } from '../controllers/googleCalendar.controller.js';

const router = express.Router();

router.get('/googleAppointments/:userEmail', getAppointments);
router.get('/googleCalendars/:userEmail', getCalendars);
router.post('/googleAppointments/:userEmail', postAppointment);
router.delete('/googleAppointments/:userEmail', deleteAppointment);

export default router;
