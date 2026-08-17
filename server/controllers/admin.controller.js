import User from "../models/user.model.js";
import Item from "../models/item.model.js";
import errorHandler from "./error.controller.js";
import authCtrl from "./auth.controller.js";

const listUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name email role studentNumber program origin profilePhoto passwordForAdmin updated created"
    );
    res.json(
      users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role || "student",
        studentNumber: u.studentNumber || "",
        program: u.program || "",
        origin: u.origin || "",
        profilePhoto: u.profilePhoto || "",
        password: u.passwordForAdmin || "(not available)",
        updated: u.updated,
        created: u.created,
      }))
    );
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const createUser = async (req, res) => {
  try {
    const role = ["student", "educator", "admin"].includes(req.body.role)
      ? req.body.role
      : "student";
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role,
      studentNumber: req.body.studentNumber || "",
      program: req.body.program || "",
      origin: req.body.origin || "",
      profilePhoto: req.body.profilePhoto || "",
    });
    await user.save();
    return res.status(201).json({
      message: "User created",
      user: {
        ...authCtrl.publicUser(user),
        password: user.passwordForAdmin,
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err) || err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const fields = [
      "name",
      "email",
      "role",
      "studentNumber",
      "program",
      "origin",
      "profilePhoto",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.updated = Date.now();
    await user.save();

    return res.json({
      ...authCtrl.publicUser(user),
      password: user.passwordForAdmin || "(not available)",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err) || err.message,
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (String(user._id) === String(req.auth._id)) {
      return res.status(400).json({ error: "Cannot delete your own admin account" });
    }
    await user.deleteOne();
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ created: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const createItem = async (req, res) => {
  try {
    const sellerId = req.body.sellerId || req.auth._id;
    const seller = await User.findById(sellerId).select("name email");
    if (!seller) return res.status(404).json({ error: "Seller user not found" });

    const item = new Item({
      title: req.body.title,
      price: Number(req.body.price),
      category: req.body.category || "Other",
      description: req.body.description || "",
      mediaUrl: req.body.mediaUrl || "",
      mediaType: req.body.mediaType || "",
      seller: seller._id,
      sellerName: seller.name,
      sellerEmail: seller.email,
    });
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });
    await item.deleteOne();
    return res.json({ message: "Item deleted" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  listUsers,
  createUser,
  updateUser,
  removeUser,
  listItems,
  createItem,
  removeItem,
};
