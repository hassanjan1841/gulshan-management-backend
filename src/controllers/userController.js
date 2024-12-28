import { User, Teacher, Student } from "../models/userModel.js";
import { validationResult } from "express-validator";

// Create a new user
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { role } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const user = await Model.create(req.body);

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin access only)
const getAllUsers = async (req, res) => {
  try {
    const { role, status, batch, teacher, course } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.is_passed_out = status == "false" ? false : true;
    if (!batch == "undefined") filter["section.batch._id"] = batch;
    if (!teacher == "undefined") filter["section.teacher._id"] = teacher;
    if (!course == "undefined") filter["course"] = course;
    console.log("filter", filter);

    const Model = role === "teacher" ? Teacher : Student;
    const users = await Model.find(role === "teacher" ? {} : filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await Model.countDocuments(filter);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific user by ID
const getUser = async (req, res) => {
  try {
    const tokenUser = req.user;
    const Model = tokenUser.role === "teacher" ? Teacher : Student;

    const user = await Model.findById(tokenUser._doc._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
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
    const { role } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const updatedUser = await Model.findByIdAndUpdate(id, req.body, {
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
    const { role } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const deletedUser = await Model.findByIdAndDelete(id);

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
