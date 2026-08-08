import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
  schoolname: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  campus: {
    type: String,
    trim: true,
    required: "Campus is required",
  },
  description: {
    type: String,
    trim: true,
    required: "Description is required",
  }
});

export default mongoose.model("School", SchoolSchema);