import express from "express";
const router = express.Router();
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { validateCreateUser } from "../middleware/createUser.js";
import authenticateToken from "../middleware/verifyToken.js";

router.get("/",authenticateToken, getAllUsers);
router.get("/:id", getUser);

router.post("/", validateCreateUser, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
