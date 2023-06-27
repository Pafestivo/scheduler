import express from 'express';

import {
  postOrUpdateBooker,
  getBooker
} from '../controllers/bookers.controllers.js';

const router = express.Router();

router.post('/bookers', postOrUpdateBooker);
router.get('/bookers/:bookerHash', getBooker);

export default router;
