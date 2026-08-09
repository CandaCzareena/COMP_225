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
    required: "Message text is required",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.index({ sender: 1, recipient: 1, created: -1 });

export default mongoose.model("Message", MessageSchema);
