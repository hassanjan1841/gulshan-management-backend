import express from "express";
import {
  createAssignment
} from "../controllers/assignmentController.js"; // Import controller functions

const router = express.Router();

// Route to create a new course
router.post("/", createAssignment);

export default router;
