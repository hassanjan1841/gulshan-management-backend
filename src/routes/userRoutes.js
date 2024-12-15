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

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", validateCreateUser, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
