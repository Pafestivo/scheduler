import express from "express";
import { protect } from "../middlewares/authHandler.js";

import { getTranslation } from "../controllers/translations.controller.js";

const router = express.Router();

router.get("/translations/:lang", getTranslation);

export default router;
