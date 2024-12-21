import User from "../models/userModel.js";
import { validationResult } from "express-validator";

// Create a new user
const createUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);

    // If there are validation errors, return them
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(), // Return the validation errors
      });
    }

    // Create the user
    const user = await User.create(req.body);

    // Return success response
    res.status(201).json({ success: true, user });
  } catch (error) {
    // Handle errors such as duplicate email or phone
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin access only)
const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query dynamically
    const filter = {};
    if (role) filter.role = role; // Filter by role (e.g., "admin", "teacher", "student")
    if (status) filter.status = status; // Filter by status (e.g., "active", "inactive")

    // Fetch paginated and filtered data
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      users,
      pagination: {
        totalUsers,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        hasNextPage: page * limit < totalUsers,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific user by ID
const getUser = async (req, res) => {
  try {
    // const { id } = req.params;
    // console.log("id", id);
    // Find user by ID
    const user = await User.findById(req.user._doc._id);
    console.log("user in getUser in request=> ", req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log("user in getUser database=> ", user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a specific user's details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("updateuser body", req.body);
    // Validate if ID is provided in the request body;

    // Ensure role is valid if present in the request
    // if (role && !["admin", "teacher", "student"].includes(role)) {
    //   return res.status(400).json({
    //     message:
    //       "Invalid role provided. Allowed roles are admin, teacher, or student.",
    //   });
    // }

    // Update the user by ID
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).exec();
    console.log("updatedUser", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, createUser, getUser, updateUser, deleteUser };
