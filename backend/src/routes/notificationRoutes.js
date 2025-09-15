import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/notifications", authMiddleware, getNotifications);

export default router;
