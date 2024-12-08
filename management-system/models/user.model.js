import AutoIncrement from "mongoose-sequence";
import mongoose from "mongoose";

const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    live: {
      type: String,
      required: false,
    },
    github: {
      type: String,
      required: false,
    },
    stack: {
      type: Array,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
BlogSchema.plugin(AutoIncrement, { inc_field: "num" });

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
