import { UserModal } from "../models/userModel.js";
const { User } = UserModal;
// Create a new user
const createUser = async (req, res) => {
  try {
    // Check if required fields are provided
    const { name, age, email, phone, role } = req.body;
    console.log(req.body);
    if (!name || !age || !email || !phone || !role) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Ensure role is valid
    const validRoles = ["admin", "teacher", "student"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role provided. Allowed roles are admin, teacher, or student.",
      });
    }

    // Create the user
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    // Handle errors such as duplicate email or phone
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin access only)
const getAllUsers = async (req, res) => {
  try {
    // Admins should be able to see all users
    const users = await User.find({}).sort({ createdAt: -1 });

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
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);

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

    // Validate if ID is provided in the request body
    const { name, age, email, phone, role } = req.body;

    // Ensure role is valid if present in the request
    if (role && !["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role provided. Allowed roles are admin, teacher, or student.",
      });
    }

    // Update the user by ID
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

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
