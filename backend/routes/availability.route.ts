import express from 'express';

import {
  addAvailability,
  deleteAvailability,
  updateAvailability
} from '../controllers/availability.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('/availability', protect, addAvailability)
router.delete('/availability', protect, deleteAvailability)
router.put('/availability', protect, updateAvailability)


export default router;
