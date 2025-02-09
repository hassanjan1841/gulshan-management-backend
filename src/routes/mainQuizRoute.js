import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllQuestionsFromQuiz,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  deleteQuestionFromQuiz,
  getQuestionFromQuiz,
} from "../controllers/mainQuizController.js"; // Assuming your quiz controller is correctly set

const router = express.Router();

// Route to create a new quiz
router.post("/", createQuiz);

// Route to get all quizzes
router.get("/", getAllQuizzes);

// Route to get a single quiz by ID
router.get("/:id", getQuizById);

// Route to update a quiz by ID
router.put("/:id", updateQuiz);

// Route to delete a quiz by ID
router.delete("/:id", deleteQuiz);

// Route to get all questions from quiz by ID
router.get("/:id/questions", getAllQuestionsFromQuiz);

// Route to add a question to a specific quiz by ID
router.post("/:id/questions", addQuestionToQuiz);

// Route to get a question in a specific quiz by quiz ID and question ID
router.get("/:id/questions/:questionId", getQuestionFromQuiz);

// Route to update a question in a specific quiz by quiz ID and question ID
router.put("/:id/questions/:questionId", updateQuestionInQuiz);

// Route to delete a question from a specific quiz by quiz ID and question ID
router.delete("/:id/questions/:questionId", deleteQuestionFromQuiz);

export default router;
