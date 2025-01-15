import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [1, "Title must be at least 1 character long"],
    },
    description: {
      type: String,
      default: null, // Optional field, defaults to null if not provided
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lateUploadAllowed: {
      type: Boolean,
      default: true,
    },
    pictures: [String], // Array to store multiple pictures
  },
  { timestamps: true }
);

// Create the Assignment model
const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
