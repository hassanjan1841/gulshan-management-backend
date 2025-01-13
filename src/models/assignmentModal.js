import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [1, "Title must be at least 1 character long"],
  },
      section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
      },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  description: {
    type: String,
    default: null, // Optional field, defaults to null if not provided
  },
  pictures: [
    {
      data: Buffer, // Binary data for the picture
      fileName: String, // File name
      fileType: String, // MIME type (e.g., image/jpeg, image/png)
    },
  ], // Array to store multiple pictures
},
{ timestamps: true });

// Create the Assignment model
const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
