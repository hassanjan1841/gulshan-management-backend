import Batch from "../models/batchModel.js";
import Course from "../models/courseModel.js";
import { Student, Teacher } from "../models/userModel.js";

// CREATE a new course
export const createCourse = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if the course title already exists
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course with this title already exists." });
    }

    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all courses
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { city, country } = req.query;
    // console.log("city", city);
    if (city || country) {
      return getCoursesByCityAndCountry(req, res);
    }

    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }

    res.status(200).json({
      courses,
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Assuming you have separate models for instructors, students, and batches

    const instructors = await Teacher.countDocuments({ course: id });
    const students = await Student.countDocuments({ course: id });
    const batches = await Batch.countDocuments({ course: id });

    res.status(200).json({
      course,
      instructors,
      students,
      batches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a course by ID
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a course by ID
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoursesByCityAndCountry = async (req, res) => {
  try {
    const { city, country } = req.query;
    // console.log("city", city);
    const batches = await Batch.find({
      city,
      country,
      is_admission_open: true,
    }).populate("course");
    console.log(batches);
    if (!batches || batches.length === 0) {
      return res.status(404).json({
        message: "No batches found for the specified city and country.",
      });
    }

    const courses = batches.map((batch) => batch.course);

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
