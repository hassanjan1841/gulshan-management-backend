import Branch from "../models/branchModel.js";

// CREATE a new branch
export const createBranch = async (req, res) => {
  try {
    // Check if the branch title already exists
    const { title } = req.body;
    const existingBranch = await Branch.findOne({ title });
    if (existingBranch) {
      return res
        .status(400)
        .json({ message: "Branch with this title already exists." });
    }

    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).json({ message: "Branch created successfully", branch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all branches
export const getAllBranches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { createNewBranch, country, city } = req.query;

    const branches = await Branch.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBranches = await Branch.countDocuments();

    if (!branches || branches.length === 0) {
      return res.status(404).json({ message: "No branches found." });
    }

    res.status(200).json({
      branches,
      totalBranches,
      totalPages: Math.ceil(totalBranches / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single branch by ID
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // If you want to count associated documents like students or teachers, 
    // adjust the related models accordingly (e.g., if there are students or teachers tied to a branch).

    res.status(200).json({ branch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a branch by ID
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBranch = await Branch.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch updated successfully", updatedBranch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a branch by ID
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
