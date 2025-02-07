import express from "express";

const router = express.Router();
import {
  scheduleEmail,
  sendEmailController,
} from "../controllers/emailController.js";

router.post("/", sendEmailController);
router.post("/schedule", scheduleEmail);

export default router;
