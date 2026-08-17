import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  actor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  actorName: {
    type: String,
    trim: true,
    default: "Someone",
  },
  type: {
    type: String,
    enum: ["connect", "message", "post", "meeting"],
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    default: "",
  },
  link: {
    type: String,
    trim: true,
    default: "home",
  },
  meta: {
    type: Object,
    default: {},
  },
  read: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

NotificationSchema.index({ recipient: 1, created: -1 });

export default mongoose.model("Notification", NotificationSchema);
