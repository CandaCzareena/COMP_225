import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  price: {
    type: Number,
    required: "Price is required",
    min: 0,
  },
  category: {
    type: String,
    trim: true,
    default: "Other",
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  icon: {
    type: String,
    trim: true,
    default: "marketplace-icon",
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
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  sellerName: {
    type: String,
    trim: true,
    default: "Student",
  },
  sellerEmail: {
    type: String,
    trim: true,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Item", ItemSchema);
