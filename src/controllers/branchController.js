import Branch from "../models/branchModel.js";

// CREATE a new course
export const createBranch = async (req, res) => {
  try {
    // Check if the course title already exists
    const { title, country, city } = req.body;
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

    if (createNewBranch) {
      return getAllCountriesFromBranch(req, res);
    }
    if (country && !city) {
      return getAllCitiesByCountry(req, res);
    }
    if (city && country) {
      return getBranchesByCity(req, res);
    }
    const branches = await Branch.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBranches = branches.length;

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
      country
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
        title: branch.title
      };
    });
    res.status(200).json({ branches: citybranches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single course by ID
// export const getCourseById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findById(id);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Assuming you have separate models for instructors, students, and batches

//     const instructors = await Teacher.countDocuments({ course: id });
//     const students = await Student.countDocuments({ course: id });
//     const batches = await Batch.countDocuments({ course: id });

//     res.status(200).json({
//       course,
//       instructors,
//       students,
//       batches,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// UPDATE a course by ID
// export const updateCourse = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Course updated successfully", updatedCourse });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// DELETE a course by ID
// export const deleteCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findByIdAndDelete(id);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.status(200).json({ message: "Course deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
