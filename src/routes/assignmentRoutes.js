import express from "express";
import { createAssignment , getAllAssignment} from "../controllers/assignmentController.js";
const router = express.Router();

router.get('/', getAllAssignment)
router.post('/', createAssignment)


export default router;