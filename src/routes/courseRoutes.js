import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js"; // Import controller functions
import authenticateToken from "../middleware/verifyToken.js";
// import verifyRoles from "../middleware/verifyRoles.js";

const router = express.Router();

// Route to create a new course
router.post("/", authenticateToken, createCourse);

// Route to get all courses
router.get("/", getAllCourses);

// Route to get a single course by ID
router.get("/:id", getCourseById);

// Route to update a course by ID
router.put("/:id", updateCourse);

// Route to delete a course by ID
router.delete("/:id", deleteCourse);

export default router;
