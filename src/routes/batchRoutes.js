import express from "express";
import {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
} from "../controllers/batchController.js";

const router = express.Router();

// Route to create a new course
router.post("/", createBatch);

// Route to get all Batches
router.get("/", getAllBatches);

// Route to get a single Batch by ID
router.get("/:id", getBatchById);

// Route to update a Batch by ID
router.put("/:id", updateBatch);

// Route to delete a Batch by ID
router.delete("/:id", deleteBatch);

export default router;