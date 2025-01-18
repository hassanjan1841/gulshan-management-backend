import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
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
    days: {
      type: [String],
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    startTime: { type: String, required: true }, // e.g., '09:00:00'
    endTime: { type: String, required: true }, // e.g., '11:00:00'
    room: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Section = mongoose.model("Section", sectionSchema);
const PreviousSection = mongoose.model("PreviousSection", sectionSchema); // For archived sections

export { Section, PreviousSection };
