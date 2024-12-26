import Batch from "../models/batchModel.js";
import Course from "../models/courseModel.js";
// CREATE a new Batch
export const createBatch = async (req, res) => {
  try {
    const { course, title } = req.body;

    // Check if the batch title already exists
    const existingBatch = await Batch.findOne({ course });
    console.log("existingBatch", existingBatch);
    
    if (existingBatch && existingBatch.title === title) {
      return res
        .status(400)
        .json({ message: "Batch with this title already exists." });
    }

    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all Batches
export const getAllBatches = async (req, res) => {
  try {
    const batch = await Batch.find().populate("course");

    if (!batch || batch.length === 0) {
      return res.status(404).json({ message: "No batches found." });
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single Batch by ID
export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id).populate("course");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a Batch by ID
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res
      .status(200)
      .json({ message: "Batch updated successfully", updatedBatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a Batch by ID
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByIdAndDelete(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all Batches by Course ID
export const getBatchesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const batches = await Batch.find({ course: courseId }).populate(
      "course",
      "title"
    );

    if (!batches || batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found for this course." });
    }

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
