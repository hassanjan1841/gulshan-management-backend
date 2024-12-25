import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "merged", "finished"],
      default: "pending",
    },
    days: { type: String, required: true }, // e.g., 'MWF', 'TTS'
    startTime: { type: String, required: true }, // e.g., '09:00:00'
    endTime: { type: String, required: true }, // e.g., '11:00:00'
    room: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Section = mongoose.model("Section", sectionSchema);

export default Section;
