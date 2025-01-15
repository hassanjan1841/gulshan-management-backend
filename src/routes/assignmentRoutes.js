import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAllAssignment,
  updateAssignment,
} from "../controllers/assignmentController.js";
import { createAssignmentValidation } from "../middleware/createAssignment.js";
const router = express.Router();

router.post("/", createAssignmentValidation, createAssignment);
router.get("/", getAllAssignment);
router.delete("/:id", deleteAssignment);
router.put("/:id", updateAssignment);

export default router;
