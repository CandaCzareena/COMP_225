import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";

const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString();
};

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
        lastMessage: msg.text,
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
      "name email profilePhoto"
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
      },
      messages: messages.map((msg) => ({
        id: String(msg._id),
        senderId: String(msg.sender?._id || msg.sender),
        sender: msg.sender?.name || "Student",
        text: msg.text,
        time: formatTime(msg.created),
        created: msg.created,
      })),
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
    const { recipientId, text } = req.body;

    if (!recipientId || !text?.trim()) {
      return res.status(400).json({
        error: "recipientId and text are required",
      });
    }

    if (String(senderId) === String(recipientId)) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    const recipient = await User.findById(recipientId).select("_id name email");
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      text: text.trim(),
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name email")
      .lean();

    return res.status(201).json({
      id: String(populated._id),
      senderId: String(populated.sender._id),
      sender: populated.sender.name,
      recipientId: String(recipient._id),
      text: populated.text,
      time: formatTime(populated.created),
      created: populated.created,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { listConversations, listWithUser, create };
