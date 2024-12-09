import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the base user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
      required: true,
    },
    profilePic: {
      type: String, // URL or path to the profile picture
    },
  },
  { timestamps: true },
  { discriminatorKey: "role" }
); // discriminatorKey allows role-based extension

// Create the base model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Admin-specific schema
const adminSchema = new Schema({
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  batches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
});

// Teacher-specific schema
const teacherSchema = new Schema({
  timings: [
    {
      type: String, // Example: 'Mon-Wed 10:00 AM - 1:00 PM'
    },
  ],
  batch: {
    type: Schema.Types.ObjectId,
    ref: "Batch",
  },
  assignments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  qualifications: [
    {
      type: String,
    },
  ],
  enrolledCourses: [
    {
      name: String,
      code: String,
      instructor: { type: Schema.Types.ObjectId, ref: "User" },
      duration: String,
      timings: String,
    },
  ],
});

// Student-specific schema
const studentSchema = new Schema({
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  batch: {
    type: Schema.Types.ObjectId,
    ref: "Batch",
  },
  assignments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  guardianDetails: {
    name: String,
    phone: String,
    relationship: String,
  },
});

// Create discriminators for each role
const Admin = User.discriminator("admin", adminSchema);
const Teacher = User.discriminator("teacher", teacherSchema);
const Student = User.discriminator("student", studentSchema);

export const UserModal = { User, Admin, Teacher, Student };
