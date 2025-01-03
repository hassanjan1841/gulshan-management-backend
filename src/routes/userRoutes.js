import express from "express";
const router = express.Router();
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  
  validateStudent,
} from "../middleware/createUser.js";
import authenticateToken from "../middleware/verifyToken.js";

router.get("/", getAllUsers);
router.get("/me", authenticateToken, getUser);

router.post("/", validateStudent, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
