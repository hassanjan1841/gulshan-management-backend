import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each question
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: [String], required: true },
  type: { type: String, enum: ["single", "multiple"], required: true },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    // required: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    // required: true,
  },
  questions: [questionSchema],
  active: { type: Boolean, default: false },
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
