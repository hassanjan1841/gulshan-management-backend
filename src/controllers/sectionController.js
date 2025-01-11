import Section from "../models/sectionModel.js";

// CREATE a new Section
export const createSection = async (req, res) => {
  try {
    const { days, startTime, endTime, room,teacher } = req.body;
    console.log("days", days);
    const conflict = await Section.findOne({
      days,
      $or: [
        { room }, // Same room
        { teacher }, // Same instructor
      ],
      $and: [
        { startTime: { $lt: endTime } }, // Check overlapping
        { endTime: { $gt: startTime } },
      ],
    });

    // Check if the Section title already exists
    if (conflict) {
      return res.status(400).json({ message: "Section already exists." });
    }

    const section = new Section(req.body);
    await section.save();
    res.status(201).json({ message: "Section created successfully", section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all sections with pagination
export const getAllSections = async (req, res) => {
  try {
    const { batch } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (batch && batch !== "undefined") {
      query.batch = batch;
    }

    const sections = await Section.find(query)
      .populate("course")
      .populate("batch")
      .populate("teacher")
      .skip(skip)
      .limit(limit);

    const totalSections = await Section.countDocuments(query);
    const totalPages = Math.ceil(totalSections / limit);

    if (!sections || sections.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No sections found." });
    }

    res.status(200).json({
      error: false,
      sections,
      page,
      totalPages,
      totalSections,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single Section by ID
export const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findById(id)
      .populate("course")
      .populate("batch")
      .populate("teacher");

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a Section by ID
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { days, startTime, endTime, room, teacher } = req.body;

    // Check for conflicts
    const conflict = await Section.findOne({
      days,
      $or: [
        { room }, // Same room
        { teacher }, // Same instructor
      ],
      $and: [
        { startTime: { $lt: endTime } }, // Check overlapping
        { endTime: { $gt: startTime } },
      ],
      _id: { $ne: id }, // Exclude the current section
    });

    if (conflict) {
      return res.status(400).json({ message: "Section conflict exists." });
    }

    const updatedSection = await Section.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    res
      .status(200)
      .json({ message: "Section updated successfully", updatedSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a Section by ID
export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findByIdAndDelete(id);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
