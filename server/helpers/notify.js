import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export async function createNotification({
  recipientId,
  actorId,
  actorName,
  type,
  title,
  body = "",
  link = "home",
  meta = {},
}) {
  if (!recipientId) return null;
  if (actorId && String(recipientId) === String(actorId)) return null;

  return Notification.create({
    recipient: recipientId,
    actor: actorId || undefined,
    actorName: actorName || "Someone",
    type,
    title,
    body,
    link,
    meta,
  });
}

export async function notifyUsers(userIds, payload) {
  const unique = [...new Set((userIds || []).map((id) => String(id)))].filter(
    (id) => id && (!payload.actorId || id !== String(payload.actorId))
  );

  if (!unique.length) return [];

  const docs = unique.map((recipientId) => ({
    recipient: recipientId,
    actor: payload.actorId || undefined,
    actorName: payload.actorName || "Someone",
    type: payload.type,
    title: payload.title,
    body: payload.body || "",
    link: payload.link || "home",
    meta: payload.meta || {},
  }));

  return Notification.insertMany(docs, { ordered: false });
}

export async function notifyAllUsersExcept(actorId, payload) {
  const users = await User.find(
    actorId ? { _id: { $ne: actorId } } : {}
  ).select("_id");
  return notifyUsers(
    users.map((u) => u._id),
    { ...payload, actorId }
  );
}
