import express from 'express';

import {
  postOrUpdateBooker
} from '../controllers/bookers.controllers.js';

const router = express.Router();

router.post('/bookers', postOrUpdateBooker);

export default router;
