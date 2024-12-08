import User from "../models/user.model.js";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await User.findByIdAndUpdate(id, req.body);
    if (!project) {
      res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await User.findByIdAndDelete(id);
    if (!project) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json("User Deleted Successfully");
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
