import Batch from "../models/batchModel.js";
import Course from "../models/courseModel.js";
// CREATE a new Batch
export const createBatch = async (req, res) => {
  try {
    const { course, title } = req.body;
    console.log("createbatch", req.body);
    // Check if the batch title already exists
    const existingBatch = await Batch.find({ course });
    if (existingBatch.length > 0) {
      // Check if any batch title matches the requested title
      const titleMatch = existingBatch.some((data) => data.title === title);
      if (titleMatch) {
        console.log("match hogya");
        return res.status(400).json({
          error: true,
          message: "Batch with this course already exists.",
        });
      }
    }

    const batch = new Batch(req.body);
    await batch.save();
    res
      .status(201)
      .json({ error: false, message: "Batch created successfully", batch });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

// READ all Batches
export const getAllBatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { course, admissionOpen, country, city } = req.query;
    const query = {};
    if (course && course !== "undefined") query.course = course;
    if (admissionOpen && admissionOpen !== "undefined") {
      return getAllCountriesFromBatchWithAdmissionOpen(req, res);
    }
    if (country && !city && !course && country !== "undefined") {
      return getAllCitiesByCountry(req, res);
    }
    // console.log("city", city);
    if (
      city &&
      country &&
      !course &&
      city !== "undefined" &&
      country !== "undefined"
    ) {
      return getCoursesByCityAndCountry(req, res);
    }
    if (
      course &&
      city &&
      country &&
      course !== "undefined" &&
      city !== "undefined" &&
      country !== "undefined"
    ) {
      return getBranchesByCountryCityAndCourse(req, res);
    }

    // if (course && course !== "undefined") {
    //   query.course = course;
    // }

    const batches = await Batch.find(query)
      .populate("course")
      .populate("branch");
    // .sort({ createdAt: -1 })
    // .skip(skip)
    // .limit(limit);

    const totalBatches = await Batch.countDocuments(query);

    if (!batches || batches.length == 0) {
      return res
        .status(404)
        .json({ error: true, message: "No batches found." });
    }

    res.status(200).json({
      batches,
      totalBatches,
      // totalPages: Math.ceil(totalBatches / limit),
      // currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
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
// Function to get all countries from batches with admission open
export const getAllCountriesFromBatchWithAdmissionOpen = async (req, res) => {
  try {
    const { admissionOpen } = req.query;
    let isAdmissionOpen = admissionOpen == "true" ? true : false;
    // console.log("isAdmissionOpen", isAdmissionOpen);
    const batches = await Batch.find({
      is_admission_open: isAdmissionOpen,
    })
      .populate("course")
      .populate("branch");
    // console.log("batches in admission open,", batches);

    if (!batches || batches.length === 0) {
      return res.status(404).json({
        message: "No batches found with admission open.",
      });
    }

    const countries = batches.map((batch) => batch.branch.country);
    // console.log("countriesr", batches);
    const uniqueCountries = [...new Set(countries)]; // Return unique countries
    // console.log("uniqueCountries", uniqueCountries);

    res.status(200).json({ countries: uniqueCountries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Function to get all cities from batches by country
export const getAllCitiesByCountry = async (req, res) => {
  try {
    const { country } = req.query;
    // console.log("country in getallcities=>", country);
    const batches = await Batch.find({
      is_admission_open: true,
    })
      .populate({
        path: "branch",
        match: { country },
      })
      .populate("course");

    if (!batches || batches.length === 0) {
      return res.status(404).json({
        message: "No batches found for this country.",
      });
    }

    console.log("uniqueCities", batches);
    const cities = batches.map((batch) => batch.branch.city);
    const uniqueCities = [...new Set(cities)]; // Return unique cities

    res.status(200).json({ cities: uniqueCities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCoursesByCityAndCountry = async (req, res) => {
  try {
    const { city, country } = req.query;
    // console.log("city", city);
    const batches = await Batch.find({
      is_admission_open: true,
    })
      .populate({
        path: "branch",
        match: { city, country },
      })
      .populate("course");
    // console.log(batches);
    if (!batches || batches.length === 0) {
      return res.status(404).json({
        message: "No batches found for the specified city and country.",
      });
    }

    const courses = batches.map((batch) => batch.course);

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Function to get branches by country, city, and course
export const getBranchesByCountryCityAndCourse = async (req, res) => {
  try {
    const { country, city, course } = req.query;
    const batches = await Batch.find({
      country,
      city,
      course,
      is_admission_open: true,
    }).populate("course");

    if (!batches || batches.length === 0) {
      return res.status(404).json({
        message:
          "No branches found for the specified country, city, and course.",
      });
    }

    const branches = batches.map((batch) => batch.branch);
    const uniqueBranches = [...new Set(branches)]; // Return unique branches

    res.status(200).json({ branches: uniqueBranches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
