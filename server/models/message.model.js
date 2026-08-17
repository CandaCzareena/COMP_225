import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "Sender is required",
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "Recipient is required",
  },
  text: {
    type: String,
    trim: true,
    default: "",
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
  messageType: {
    type: String,
    enum: ["text", "media", "meeting"],
    default: "text",
  },
  meetingTitle: {
    type: String,
    trim: true,
    default: "",
  },
  meetingAt: {
    type: Date,
  },
  meetingLocation: {
    type: String,
    trim: true,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.index({ sender: 1, recipient: 1, created: -1 });

export default mongoose.model("Message", MessageSchema);
