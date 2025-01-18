import { createAssignmentValidation } from "../middleware/createAssignment.js";
import Assignment from "../models/assignmentModal.js";
// import { User, Teacher, Student } from "../models/userModel.js";
import { validationResult } from "express-validator";
import Assignment from "../models/assignmentModal.js";


//get all assignments
const getAllAssignment = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const { section } = req.query;
      const query = {};
      if (section && section !== undefined) query.section = section;
      console.log("query >", query);
  
      const assignments = await Assignment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      const totalAssignments = await Assignment.countDocuments();
  
      if (!assignments || assignments.length === 0) {
        return res.status(404).json({ message: "No assignments found." });
      }
  
      res.status(200).json({
        assignments,
        totalAssignments,
        totalPages: Math.ceil(totalAssignments / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };


// Create a new Assignmnt
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


export {getAllAssignment, createAssignment };
