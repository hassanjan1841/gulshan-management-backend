import express from "express";
import {
    createAssignment,
    getAllAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById
} from "../controllers/assignmentController.js"; // Import controller functions
import { assignmentValidationRules } from "../middleware/createAssignment.js";

const router = express.Router();

// Route to create a new assignment
router.post("/", assignmentValidationRules, createAssignment);

// Route to get all Assignment
router.get("/", getAllAssignment);

// Route to get a single Assignment by ID
router.get("/:id", getAssignmentById);

// Route to update a Assignment by ID
router.put("/:id", updateAssignment);

// Route to delete a Assignment by ID
router.delete("/:id", deleteAssignment);

export default router;
