import express from "express";
import {
  createAssignmentSubmission,
  getAllAssignmentSubmissions,
  getAssignmentSubmissionById,
  updateAssignmentSubmission,
  deleteAssignmentSubmission,
} from "../controllers/assignmentSubmissionController.js";

const router = express.Router();

router.post("/", createAssignmentSubmission);
router.get("/", getAllAssignmentSubmissions);
router.get("/:id", getAssignmentSubmissionById);
router.put("/:id", updateAssignmentSubmission);
router.delete("/:id", deleteAssignmentSubmission);

export default router;
