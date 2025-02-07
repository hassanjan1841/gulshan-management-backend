import { createAssignmentValidation } from "../middleware/createAssignment.js";
import { validationResult } from "express-validator";
import Assignment from "../models/assignmentModal.js";
import AssignmentSubmission from "../models/assignmentSubmissions.js";

//get all assignments
// const getAllAssignment = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const skip = (page - 1) * limit;
//       const { section } = req.query;
//       const query = {};
//       if (section && section !== undefined) query.section = section;
//       console.log("query >", query);

//       const assignments = await Assignment.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);

//       const totalAssignments = await Assignment.countDocuments();

//       if (!assignments || assignments.length === 0) {
//         return res.status(404).json({ message: "No assignments found." });
//       }

//       res.status(200).json({
//         assignments,
//         totalAssignments,
//         totalPages: Math.ceil(totalAssignments / limit),
//         currentPage: page,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: error.message });
//     }
//   };

// Create a new Assignmnt
const createAssignment = async (req, res) => {
  try {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     success: false,
    //     errors: errors.array(),
    //   });
    // }

    const assignment = new Assignment(req.body);

    await assignment.save();

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id).populate("section");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
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

    // Build the filter object
    const filter = {};
    if (batch && batch !== "undefined") filter.batch = batch;
    if (teacher && teacher !== "undefined") filter.teacher = teacher;
    if (course && course !== "undefined") filter.course = course;
    if (section && section !== "undefined") filter.section = section;
    if (search && search !== "undefined") {
      filter.title = { $regex: search, $options: "i" };
    }

    // Fetch assignments with basic filtering, skipping, and limiting
    const assignments = await Assignment.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("section")
      .lean();

    // Process assignments to calculate the status
    const processedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        // Fetch related submissions for each assignment
        const submissions = await AssignmentSubmission.find({
          assignment: assignment._id,
        });

        // Determine status based on submissions and dueDate
        const status =
          submissions.length === 0
            ? new Date() < new Date(assignment.dueDate)
              ? "Pending"
              : "Missed"
            : submissions.some(
                (sub) =>
                  new Date(sub.submittedAt) > new Date(assignment.dueDate)
              )
            ? "Late"
            : "Submitted";

        return { ...assignment, status, submissions: submissions.length };
      })
    );

    // Total assignments for pagination
    const totalAssignments = await Assignment.countDocuments(filter);
    const totalPages = Math.ceil(totalAssignments / limit);

    if (!processedAssignments || processedAssignments.length === 0) {
      return res.status(404).json({ message: "No assignments found." });
    }

    // Send response
    res.status(200).json({
      success: true,
      assignments: processedAssignments,
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
  getAssignmentById,
};
function determineStatus(submissions, dueDate) {
  if (!submissions || submissions.length === 0) {
    return new Date() < dueDate ? "Pending" : "Missed";
  }

  const isAnySubmissionOnTime = submissions.some(
    (submission) => submission.submittedAt <= dueDate
  );
  const isAnySubmissionLate = submissions.some(
    (submission) => submission.submittedAt > dueDate
  );

  if (isAnySubmissionOnTime) {
    return "Submitted";
  } else if (isAnySubmissionLate) {
    return "Late";
  } else {
    return new Date() < dueDate ? "Pending" : "Missed";
  }
}
