import Notification from "../models/notification.model.js";
import errorHandler from "./error.controller.js";

const list = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const notifications = await Notification.find({ recipient: req.auth._id })
      .sort({ created: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient: req.auth._id,
      read: false,
    });

    return res.json({
      unreadCount,
      notifications: notifications.map((n) => ({
        id: String(n._id),
        type: n.type,
        title: n.title,
        body: n.body,
        link: n.link,
        actorName: n.actorName,
        meta: n.meta || {},
        read: n.read,
        created: n.created,
        time: new Date(n.created).toLocaleString(),
      })),
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const markRead = async (req, res) => {
  try {
    const note = await Notification.findOne({
      _id: req.params.notificationId,
      recipient: req.auth._id,
    });
    if (!note) return res.status(404).json({ error: "Notification not found" });
    note.read = true;
    await note.save();
    return res.json({ message: "Marked as read" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.auth._id, read: false },
      { $set: { read: true } }
    );
    return res.json({ message: "All notifications marked as read" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { list, markRead, markAllRead };
