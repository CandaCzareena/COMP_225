import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  username: {
    type: String,
    trim: true,
    required: "Username is required",
  },
  posted: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    trim: true,
    required: "Content is required",
  },
  mediaUrl: {
    type: String,
    trim: true,
    default: "",
  },
  mediaType: {
    type: String,
    enum: ["", "image", "video"],
    default: "",
  },
});

export default mongoose.model("Blog", BlogSchema);
