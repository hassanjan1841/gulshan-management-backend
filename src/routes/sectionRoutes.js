import express from "express";
import {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
  getAllTeacherSection
} from "../controllers/sectionController.js";

const router = express.Router();

// Route to create a new course
router.post("/", createSection);

// Route to get all SEction
router.get("/", getAllSections);

// Route to get all SEction by teacher
router.get("/teacher", getAllTeacherSection);

// Route to get a single Section by ID
router.get("/:id", getSectionById);

// Route to update a Section by ID
router.put("/:id", updateSection);

// Route to delete a Section by ID
router.delete("/:id", deleteSection);

export default router;
