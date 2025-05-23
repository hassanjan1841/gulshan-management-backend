import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the base user schema (common fields)
const userSchema = new Schema(
  {
    full_name: {
      type: String,
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
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    profilePic: {
      type: String, // URL or path to the profile picture
    },
  },
  { timestamps: true, discriminatorKey: "role" } // discriminatorKey allows role-based extension
);

// Create the base User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Teacher-specific schema (no student-specific fields)
const teacherSchema = new Schema({
  qualifications: {
    type: [String], // Changed to String
    required: true,
  },
  experience: {
    type: Number,
    default: 0,
    required: true,
  },
  subjects: {
    type: String, // Changed to String
    required: true,
  },
  salary: {
    type: Number,
    default: 0,
    required: true,
  },
  joining_date: {
    type: Date,
    required: true,
  },
  office_location: {
    type: String,
    required: true,
  },
  is_on_leave: {
    type: Boolean,
    default: false,
  },
  leave_start_date: {
    type: Date,
  },
  leave_end_date: {
    type: Date,
  },
  leave_reason: {
    type: String,
  },
  is_blocked: {
    type: Boolean,
    default: true,
  },
});

// Student-specific schema (with fields specific to students)
const studentSchema = new Schema({
  father_name: {
    type: String,
  },
  father_cnic: {
    type: String,
  },
  last_qualification: {
    type: String, // Reference to a qualifications collection (or string)
  },
  computer_proficiency: {
    type: String,
    enum: ["None", "Beginner", "Intermediate", "Advanced"],
    default: "Basic",
  },
  on_register: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  has_laptop: {
    type: String,
  },
  courses: [
    {
      batch: {type: mongoose.Schema.Types.ObjectId, ref: "Batch"},
      course: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
      status: {
        type: String,
        enum: ["pending","ongoing", "completed"],
        default: "pending",
      }, // Status for each course
      completionDate: { type: Date, default: null }, // Optional: when the course was completed
      is_quiz_passed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  roll_number: {
    type: String,
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
});
// Create discriminators for each role
const Teacher = User.discriminator("teacher", teacherSchema);
const Student = User.discriminator("student", studentSchema);

// Export the models
export { User, Teacher, Student };
