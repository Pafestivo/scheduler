import express from 'express';

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserDetails,
  updatePassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);
router.put('/updatedetails', protect, updateUserDetails);
router.put('/updatepassword', protect, updatePassword);

export default router;
