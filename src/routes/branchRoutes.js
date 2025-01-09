import express from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js"; // Assuming your branch controller is correctly set

const router = express.Router();

// Route to create a new branch
router.post("/", createBranch);

// Route to get all branches
router.get("/", getAllBranches);

// Route to get a single branch by ID
router.get("/:id", getBranchById);

// Route to update a branch by ID
router.put("/:id", updateBranch);

// Route to delete a branch by ID
router.delete("/:id", deleteBranch);

export default router;
