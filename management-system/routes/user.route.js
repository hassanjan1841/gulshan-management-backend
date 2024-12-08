const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
} = require("../controllers/blog.controller.js");

router.get("/", getAllBlogs);
router.get("/:id", getBlog);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
