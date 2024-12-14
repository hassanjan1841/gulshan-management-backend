import Course from "../models/courseModel.js";

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
    const courses = await Course.find();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }
    res.status(200).json(courses);
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

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a course by ID
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: id },
      { title, description, duration },
      { new: true }
    );

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
