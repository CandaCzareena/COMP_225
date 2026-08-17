import Item from "../models/item.model.js";
import errorHandler from "./error.controller.js";

const iconForCategory = (category) => {
  if (category === "Books") return "book-icon";
  if (category === "Electronics") return "electronics-icon";
  if (category === "Crafts") return "craft-icon";
  return "marketplace-icon";
};

const isAdmin = (auth) => auth?.role === "admin";

const create = async (req, res) => {
  try {
    const item = new Item({
      title: req.body.title,
      price: Number(req.body.price),
      category: req.body.category || "Other",
      description: req.body.description || "",
      icon: req.body.icon || iconForCategory(req.body.category),
      mediaUrl: req.body.mediaUrl || "",
      mediaType: req.body.mediaType || "",
      seller: req.auth?._id,
      sellerName: req.body.sellerName || req.body.seller?.name || "Student",
      sellerEmail: req.body.sellerEmail || req.body.seller?.email || "",
    });
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const items = await Item.find().sort({ created: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const itemByID = async (req, res, next, id) => {
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    req.item = item;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve item" });
  }
};

const read = (req, res) => res.json(req.item);

const update = async (req, res) => {
  try {
    let item = req.item;
    const ownerId = item.seller ? String(item.seller) : null;
    const requesterId = req.auth?._id ? String(req.auth._id) : null;

    if (
      ownerId &&
      requesterId &&
      ownerId !== requesterId &&
      !isAdmin(req.auth)
    ) {
      return res.status(403).json({ error: "Not authorized to update this item" });
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.price !== undefined) item.price = Number(req.body.price);
    if (req.body.category !== undefined) {
      item.category = req.body.category;
      item.icon = iconForCategory(req.body.category);
    }
    if (req.body.description !== undefined) item.description = req.body.description;
    if (req.body.icon !== undefined) item.icon = req.body.icon;
    if (req.body.mediaUrl !== undefined) item.mediaUrl = req.body.mediaUrl;
    if (req.body.mediaType !== undefined) item.mediaType = req.body.mediaType;
    item.updated = Date.now();

    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    const item = req.item;
    const ownerId = item.seller ? String(item.seller) : null;
    const requesterId = req.auth?._id ? String(req.auth._id) : null;

    if (
      ownerId &&
      requesterId &&
      ownerId !== requesterId &&
      !isAdmin(req.auth)
    ) {
      return res.status(403).json({ error: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, list, itemByID, read, update, remove };
