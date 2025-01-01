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
        .json({ message: "Batch with this course already exists." });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { course } = req.query;
    const query = {};

    if (course && course !== "undefined") {
      query.course = course;
    }

    const batches = await Batch.find(query)
      .populate("course")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBatches = await Batch.countDocuments(query);

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: "No batches found." });
    }

    res.status(200).json({
      batches,
      totalBatches,
      totalPages: Math.ceil(totalBatches / limit),
      currentPage: page,
    });
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
      return res.status(404).json({ error: true, message: "Batch not found" });
    }

    res.status(200).json({ error: false, batch: batch });
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
