import express from 'express';

import {
  getAppointments
} from '../controllers/googleCalendar.controller.js';

const router = express.Router();

router.get('/googleAppointments/:userEmail', getAppointments);

export default router;
