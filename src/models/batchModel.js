import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, //"batch 13"
    description: { type: String, required: true }, //batch ki description
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // course ki id ksee aygi (sary course list hojayngy or koi ek select hoga to oski id yaha attach hojaygi)
   
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    batch_limit: {
      type: String,
      required: true,
    },
    is_admission_open: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
