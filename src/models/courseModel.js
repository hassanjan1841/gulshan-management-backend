import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., '6 months'
    fee: { type: String },
    level: { type: String }, // e.g., 'Beginner'
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
