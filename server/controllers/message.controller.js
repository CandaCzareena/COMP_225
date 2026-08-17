import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";
import { createNotification } from "../helpers/notify.js";

const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString();
};

const previewText = (msg) => {
  if (msg.messageType === "meeting") {
    return `Meeting: ${msg.meetingTitle || "Tutor session"}`;
  }
  if (msg.mediaType === "image") return msg.text || "Photo";
  if (msg.mediaType === "video") return msg.text || "Video";
  return msg.text || "";
};

const serializeMessage = (msg) => ({
  id: String(msg._id),
  senderId: String(msg.sender?._id || msg.sender),
  sender: msg.sender?.name || "Student",
  text: msg.text || "",
  mediaUrl: msg.mediaUrl || "",
  mediaType: msg.mediaType || "",
  messageType: msg.messageType || "text",
  meetingTitle: msg.meetingTitle || "",
  meetingAt: msg.meetingAt || null,
  meetingLocation: msg.meetingLocation || "",
  time: formatTime(msg.created),
  created: msg.created,
});

const listConversations = async (req, res) => {
  try {
    const userId = req.auth._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ created: -1 })
      .populate("sender", "name email profilePhoto")
      .populate("recipient", "name email profilePhoto")
      .lean();

    const conversations = [];
    const seen = new Set();

    for (const msg of messages) {
      const senderId = String(msg.sender?._id || msg.sender);
      const recipientId = String(msg.recipient?._id || msg.recipient);
      const other =
        senderId === String(userId) ? msg.recipient : msg.sender;
      const otherId = String(other?._id || other);

      if (!otherId || seen.has(otherId)) continue;
      seen.add(otherId);

      conversations.push({
        id: otherId,
        name: other.name || "Student",
        email: other.email || "",
        profilePhoto: other.profilePhoto || "",
        lastMessage: previewText(msg),
        time: formatTime(msg.created),
        created: msg.created,
      });
    }

    return res.json(conversations);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listWithUser = async (req, res) => {
  try {
    const userId = req.auth._id;
    const otherUserId = req.params.userId;

    const otherUser = await User.findById(otherUserId).select(
      "name email profilePhoto role"
    );
    if (!otherUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    })
      .sort({ created: 1 })
      .populate("sender", "name email profilePhoto")
      .lean();

    return res.json({
      partner: {
        id: String(otherUser._id),
        name: otherUser.name,
        email: otherUser.email,
        profilePhoto: otherUser.profilePhoto || "",
        role: otherUser.role || "student",
      },
      messages: messages.map(serializeMessage),
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const create = async (req, res) => {
  try {
    const senderId = req.auth._id;
    const {
      recipientId,
      text,
      mediaUrl,
      mediaType,
      messageType,
      meetingTitle,
      meetingAt,
      meetingLocation,
    } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: "recipientId is required" });
    }

    if (String(senderId) === String(recipientId)) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    const recipient = await User.findById(recipientId).select("_id name email");
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const type = messageType || (mediaUrl ? "media" : "text");

    if (type === "meeting") {
      if (!meetingTitle?.trim() || !meetingAt) {
        return res.status(400).json({
          error: "meetingTitle and meetingAt are required for meetings",
        });
      }
    } else if (!text?.trim() && !mediaUrl) {
      return res.status(400).json({
        error: "Message text or media is required",
      });
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      text: (text || "").trim(),
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "",
      messageType: type,
      meetingTitle: meetingTitle || "",
      meetingAt: meetingAt ? new Date(meetingAt) : undefined,
      meetingLocation: meetingLocation || "",
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name email")
      .lean();

    const senderName = populated.sender?.name || "Someone";
    if (type === "meeting") {
      await createNotification({
        recipientId: recipient._id,
        actorId: senderId,
        actorName: senderName,
        type: "meeting",
        title: `${senderName} scheduled a tutor session`,
        body: `${meetingTitle} · ${new Date(meetingAt).toLocaleString()}`,
        link: "messages",
        meta: {
          partnerId: String(senderId),
          meetingTitle,
          meetingAt,
        },
      });
    } else {
      const preview =
        (text || "").trim() ||
        (mediaType === "video" ? "Sent a video" : mediaType === "image" ? "Sent a photo" : "Sent a message");
      await createNotification({
        recipientId: recipient._id,
        actorId: senderId,
        actorName: senderName,
        type: "message",
        title: `${senderName} messaged you`,
        body: preview.slice(0, 120),
        link: "messages",
        meta: { partnerId: String(senderId) },
      });
    }

    return res.status(201).json({
      ...serializeMessage(populated),
      recipientId: String(recipient._id),
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { listConversations, listWithUser, create };
