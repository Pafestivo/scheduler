import express from 'express';

import {
  addAppointment,
  getSingleAppointment,
  getAllCalendarAppointments,
  updateAppointment
} from '../controllers/appointments.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('/appointments', protect, addAppointment)
router.get('/appointments/single/:appointmentHash', getSingleAppointment)
router.get('/appointments/:calendarHash', getAllCalendarAppointments)
router.put('/appointments', protect, updateAppointment)


export default router;
