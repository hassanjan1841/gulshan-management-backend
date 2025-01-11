import Branch from "../models/branchModel.js";

// CREATE a new course
export const createBranch = async (req, res) => {
  try {
    // Check if the course title already exists
    const { title, country, city } = req.body;
    console.log("create nranch,", req.body);
    const existingBranch = await Branch.findOne({ title, country, city });
    if (existingBranch) {
      return res.status(400).json({ message: "This branch already exist." });
    }

    const newBranch = new Branch(req.body);
    await newBranch.save();
    res.status(201).json({ message: "Branch created successfully", newBranch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// READ all courses
export const getAllBranches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { createNewBranch, country, city } = req.query;
    // console.log("createNewBranch", createNewBranch, country, city);
    if (createNewBranch && createNewBranch !== "undefined") {
      return getAllCountriesFromBranch(req, res);
    }

    if (country && !city && country !== "undefined" && city !== "undefined") {
      return getAllCitiesByCountry(req, res);
    }

    if (city && country && country !== "undefined" && city !== "undefined") {
      return getBranchesByCity(req, res);
    }

    const branches = await Branch.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBranches = await Branch.countDocuments();

    if (!branches || branches.length === 0) {
      return res.status(404).json({ message: "No branches found." });
    }
    console.log("totalbranches/limit", totalBranches, skip);
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

export const getAllCountriesFromBranch = async (req, res) => {
  try {
    const branches = await Branch.find();
    // console.log("batches in admission open,", batches);

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        message: "No branches found .",
      });
    }
    const countries = branches?.map((branch) => branch.country);
    const uniqueCountries = [...new Set(countries)]; // Return unique countries
    res.status(200).json({ countries: uniqueCountries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCitiesByCountry = async (req, res) => {
  try {
    const { country } = req.query;
    // console.log("country in getallcities=>", country);
    const branches = await Branch.find({ country: country });

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        message: "No branches found for this country.",
      });
    }

    const cities = branches.map((branch) => branch.city);
    const uniqueCities = [...new Set(cities)]; // Return unique cities

    res.status(200).json({ cities: uniqueCities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchesByCity = async (req, res) => {
  try {
    const { city, country } = req.query;
    // console.log("city", city);
    const branches = await Branch.find({
      city,
      country,
    });
    // console.log(batches);
    if (!branches || branches.length === 0) {
      return res.status(404).json({
        message: "No branches found for the specified city and country.",
      });
    }

    const citybranches = branches.map((branch) => {
      return {
        _id: branch._id,
        title: branch.title,
      };
    });
    res.status(200).json({ branches: citybranches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single Branch by ID
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Assuming you have separate models for instructors, students, and batches

    const instructors = await Teacher.countDocuments({ branch: id });
    const students = await Student.countDocuments({ branch: id });
    const batches = await Batch.countDocuments({ branch: id });

    res.status(200).json({
      branch,
      instructors,
      students,
      batches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a Branch by ID
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBranch = await Branch.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res
      .status(200)
      .json({ message: "Branch updated successfully", updatedBranch });
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
