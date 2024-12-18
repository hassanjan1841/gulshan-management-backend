import Assignment from "../models/assignmentModal.js";

export const createAssignment = async (req, res) => {
  try {
    let newAssignment = await new Assignment(req.body);
     newAssignment = await newAssignment.save();
    res.status(201).json({error: false, message: "Assignment created successfully", newAssignment });
  } catch (error) {
    res.status(500).json({error: true, message: error.message });
  }
};