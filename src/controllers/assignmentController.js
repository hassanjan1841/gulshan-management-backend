import Assignment from "../models/assignmentModal.js";

// CREATE a new Batch
export const createAssignment = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if the batch title already exists
    const existingAssignment = await Assignment.findOne({ title });
    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "Assignment with this title already exists." });
    }
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();
    res.status(201).json({ message: "Batch created successfully", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all Batches
export const getAllAssignment = async (req, res) => {
  try {
    const assignments = await Assignment.find()
    .populate("section")
    .populate('createdBy')

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found." });
    }
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single Batch by ID
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id)
    .populate("section")
    .populate('createdBy');
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a Batch by ID
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res
      .status(200)
      .json({ message: "Assignment updated successfully", updatedAssignment: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a Batch by ID
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAssignment = await Assignment.findByIdAndDelete(id);
    if (!deleteAssignment) {
      return res.status(404).json({ message: "assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
