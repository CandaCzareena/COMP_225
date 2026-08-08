import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  type: {
    type: String,
    trim: true,
    required: "Type is required",
  },
  description: {
    type: String,
    trim: true,
    required: "Description is required",
  }
});

export default mongoose.model("Program", ProgramSchema);