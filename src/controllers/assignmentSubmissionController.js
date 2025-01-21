import { validationResult } from "express-validator";
import AssignmentSubmission from "../models/assignmentSubmissions.js";

const createAssignmentSubmission = async (req, res) => {
  try {
    const { assignment, student } = req.body;

    const existingSubmission = await AssignmentSubmission.findOne({
      assignment,
      student,
    });

    if (existingSubmission) {
      return res
        .status(400)
        .json({ message: "You have already submitted this Assignment." });
    }

    const newSubmission = new AssignmentSubmission(req.body);

    await newSubmission.save();

    res.status(201).json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find()
      .populate("assignment")
      .populate("student");

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found." });
    }

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAssignmentSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await AssignmentSubmission.findById(id)
      .populate("assignment")
      .populate("student");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateAssignmentSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubmission = await AssignmentSubmission.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).exec();

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json({ success: true, submission: updatedSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAssignmentSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubmission = await AssignmentSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json({ message: "Submission deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createAssignmentSubmission,
  getAllAssignmentSubmissions,
  getAssignmentSubmissionById,
  updateAssignmentSubmission,
  deleteAssignmentSubmission,
};
