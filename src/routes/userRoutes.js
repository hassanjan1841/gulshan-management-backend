import express from "express";
const router = express.Router();
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getTeacherStats,
  getCurrentUser,
  deleteCourseFromUser,
  updateUserCourse,
  getUserCourse,
} from "../controllers/userController.js";
import { validateStudent } from "../middleware/createUser.js";
import authenticateToken from "../middleware/verifyToken.js";

router.get("/", getAllUsers);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/:id", getUser);

router.post("/", validateStudent, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.get("/teacher/stats/:id", getTeacherStats);
router.delete("/:userId/course/:courseId", deleteCourseFromUser);
router.put("/:userId/course/:courseId", updateUserCourse);
router.get("/:userId/course/:courseId", getUserCourse);

export default router;
