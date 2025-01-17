import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, //"gulshan iqbal"
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    students_limit: { type: String },
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
