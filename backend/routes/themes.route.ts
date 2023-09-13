import express from "express";
import { protect } from "../middlewares/authHandler.js";

import {
  getAllThemes,
  getThemeById,
} from "../controllers/themes.controller.js";

const router = express.Router();

router.get("/themes", protect, getAllThemes);
router.get("/themes/:id", protect, getThemeById);

export default router;
