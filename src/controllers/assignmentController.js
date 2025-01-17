import { createAssignmentValidation } from "../middleware/createAssignment.js";
// import { User, Teacher, Student } from "../models/userModel.js";
import { validationResult } from "express-validator";
import Assignment from "../models/assignmentModal.js";

// Create a new user
const createAssignment = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const assignment = new Assignment(req.body);

    await assignment.save();

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin access only)
const getAllAssignment = async (req, res) => {
  try {
    const { status, batch, teacher, course, search, section } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status && status !== "undefined") filter.status = status;
    if (batch && batch !== "undefined") filter.batch = batch;
    if (teacher && teacher !== "undefined") filter.teacher = teacher;
    if (course && course !== "undefined") filter.course = course;
    if (section && section !== "undefined") filter.section = section;
    if (search && search !== "undefined") {
      filter.title = { $regex: search, $options: "i" };
    }

    const assignments = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "section",
      });

    const totalAssignments = await Assignment.countDocuments(filter);
    const totalPages = Math.ceil(totalAssignments / limit);

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found." });
    }

    res.status(200).json({
      success: true,
      assignments,
      page,
      totalPages,
      totalAssignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createAssignment,
  getAllAssignment,
  deleteAssignment,
  updateAssignment,
};
