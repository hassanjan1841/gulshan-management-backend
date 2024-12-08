const Blog = require("../models/blog.model.js");

const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Blog.findByIdAndUpdate(id, req.body);
    if (!project) {
      res.status(404).json({ message: "Blog not found" });
    }
    const updatedBlog = await Blog.findById(id);
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Blog.findByIdAndDelete(id);
    if (!project) {
      res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json("Blog Deleted Successfully");
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
};
