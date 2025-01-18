import { User, Teacher, Student } from "../models/userModel.js";
import { validationResult } from "express-validator";
import { Section } from "../models/sectionModel.js";

// Create a new user
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { role, email, phone, cnic, courses } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    // Check if user already exists
    const existingUser = await Model.findOne({
      $or: [{ email }, { phone }, { cnic }],
    });

    if (existingUser) {
      // Check if the course already exists in the user's courses array
      const courseExists = existingUser.courses.some((course) =>
        courses.some(
          (newCourse) =>
            newCourse.course.toString() === course.course.toString()
        )
      );

      if (courseExists) {
        return res.status(400).json({
          success: false,
          message:
            "User already registered with provided email, phone, or CNIC, and the course already exists.",
        });
      } else {
        // Add new courses to the existing user's courses array
        existingUser.courses.push(...courses);
        await existingUser.save();
        return res.status(200).json({
          success: true,
          message:
            "User already registered with provided email, phone, or CNIC. New courses added.",
          user: existingUser,
        });
      }
    }

    const user = await Model.create({
      ...req.body,
      date_of_birth: new Date(req.body.date_of_birth),
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin access only)
const getAllUsers = async (req, res) => {
  try {
    const { role, status, batch, teacher, course, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // console.log("search filter in backend>>", search);

    const filter = {};
    if (role && role !== "undefined") filter.role = role;
    if (status && status !== "undefined")
      filter.is_passed_out = status == "false" ? false : true;
    if (batch && batch !== "undefined") filter["section.batch._id"] = batch;
    if (teacher && teacher !== "undefined")
      filter["section.teacher._id"] = teacher;
    if (course && course !== "undefined") filter["course"] = course;
    console.log("filter", filter);
    if (search && search !== "undefined") {
      filter["full_name"] = { $regex: search, $options: "i" };
    }
    const Model = !role ? User : role === "teacher" ? Teacher : Student;
    const users = await Model.find(role ? filter : {})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(
        role === "teacher"
          ? ""
          : {
              path: "section",
              populate: [
                { path: "batch" },
                { path: "teacher" },
                { path: "course" },
              ],
            }
      )
      .populate(
        role === "student" && {
          path: "courses.course",
          path: "courses.batch",
          populate: [{ path: "course" }, { path: "branch" }],
        }
      );

    const totalUsers = await Model.countDocuments(
      role === "teacher" ? {} : filter
    );
    const totalPages = Math.ceil(totalUsers / limit);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      success: true,
      users,
      page,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific user by ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate({
        path: "section",
        populate: [{ path: "batch" }, { path: "teacher" }, { path: "course" }],
      })
      .populate({
        path: "courses",

        populate: [
          { path: "batch", populate: [{ path: "course" }, { path: "branch" }] },
        ],
      });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get a currentuser
const getCurrentUser = async (req, res) => {
  try {
    const tokenUser = req.user;
    const Model = tokenUser._doc.role === "teacher" ? Teacher : Student;
    const user = await Model.findById(tokenUser._doc._id)
      .populate({
        path: "section",
        populate: [{ path: "batch" }, { path: "teacher" }, { path: "course" }],
      })
      .populate({
        path: "courses",
        populate: [
          {
            path: "batch",
            populate: [{ path: "course" }, { path: "branch" }],
          },
          {
            path: "course",
          },
        ],
      });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a specific user's details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, courses } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    let updatedUser;
    if (courses) {
      updatedUser = await Model.findByIdAndUpdate(
        id,
        { $push: { courses: { $each: courses } } },
        { new: true }
      ).exec();
    } else {
      updatedUser = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
      }).exec();
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a specific user's course details
const updateUserCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { course } = req.body;
    console.log("courseData", req.body.course);
    const updatedUser = await Student.findOneAndUpdate(
      { _id: userId }, // Match the user document by ID
      {
        $set: {
          "courses.$[elem].course": course, // Update specific fields in the course
        },
      },
      {
        arrayFilters: [{ "elem._id": courseId }], // Match the course with the specific courseId
        new: true, // Return the updated document
        useFindAndModify: false, // Avoid deprecated usage
      }
    ).exec();

    console.log("updatedUser in usercontrol", updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: "User or course not found." });
    }

    res
      .status(200)
      .json({ updatedUser, message: "Course updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Get a specific course from a user's courses array
const getUserCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const user = await Student.findById(userId).populate({
      path: "courses",
      match: { _id: courseId },
      populate: [
        { path: "batch", populate: [{ path: "course" }, { path: "branch" }] },
      ],
    });

    if (!user || !user.courses.length) {
      return res.status(404).json({ message: "User or course not found." });
    }

    const course = user.courses.find((c) => c._id.toString() === courseId);
    console.log("course in usercontrler", course);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found in user's courses." });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const deletedUser = await Model.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a course from a user's courses array
const deleteCourseFromUser = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { role } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { $pull: { courses: { course: courseId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User or course not found." });
    }

    res.status(200).json({
      message: "Course removed from user successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Get one teacher stats
const getTeacherStats = async (req, res) => {
  try {
    const { teacher } = req.params; // Teacher ID from the route parameters

    // Step 1: Get all sections for the teacher
    const sections = await Section.find().populate({
      path: "teacher",
      match: { _id: teacher },
    });
    // console.log("sections", sections);

    // Step 2: Get all students enrolled in these sections
    const sectionIds = sections.map((section) => section._id);
    const students = await Student.find({ sections: { $in: sectionIds } });

    // Step 3: Get counts for courses and batches
    const courseCount = new Set(
      sections.map((section) => section.course.toString())
    ).size;
    const batchCount = new Set(
      sections.map((section) => section.batch.toString())
    ).size;

    // Return the statistics as a response
    res.status(200).json({
      sectionsCount: sections.length,
      studentsCount: students.length,
      courseCount,
      batchCount,
    });
  } catch (error) {
    // Log any errors and return a 500 internal server error response
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching teacher statistics.",
    });
  }
};

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getTeacherStats,
  getCurrentUser,
  deleteCourseFromUser,
  updateUserCourse,
  getUserCourse,
};
