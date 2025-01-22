import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAllAssignment,
  getAssignmentById,
  updateAssignment,
} from "../controllers/assignmentController.js";
import { createAssignmentValidation } from "../middleware/createAssignment.js";
const router = express.Router();

router.post("/", createAssignmentValidation, createAssignment);
router.get("/", getAllAssignment);
router.get("/:id", getAssignmentById);
router.delete("/:id", deleteAssignment);
router.put("/:id", updateAssignment);

export default router;
