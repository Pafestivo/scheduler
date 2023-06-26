import express from 'express';

import {
  postBooker
} from '../controllers/bookers.controllers.js';

const router = express.Router();

router.post('/bookers', postBooker);

export default router;
