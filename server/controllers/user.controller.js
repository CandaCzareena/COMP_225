import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";
const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err) || err.message || "Signup failed",
    });
  }
};
const list = async (req, res) => {
  try {
    let users = await User.find().select(
      "name email program studentNumber origin profilePhoto updated created"
    );
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    const user = req.profile;
    // Only allow safe profile fields (avoid lodash extend touching password/hash)
    const allowed = [
      "name",
      "email",
      "program",
      "studentNumber",
      "origin",
      "profilePhoto",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    user.updated = Date.now();
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      program: user.program,
      studentNumber: user.studentNumber,
      origin: user.origin,
      profilePhoto: user.profilePhoto || "",
      updated: user.updated,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.deleteOne();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await User.deleteMany({});

    return res.status(200).json({
      message: `${result.deletedCount} users deleted`
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const connect = async (req, res) => {
  try {
    const user = req.profile;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ error: "friendId is required" });
    }
    if (String(user._id) === String(friendId)) {
      return res.status(400).json({ error: "Cannot connect to yourself" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.connections)) user.connections = [];
    if (!Array.isArray(friend.connections)) friend.connections = [];

    const alreadyConnected = user.connections.some(
      (id) => String(id) === String(friendId)
    );

    if (!alreadyConnected) {
      user.connections.push(friend._id);
      friend.connections.push(user._id);
      user.updated = Date.now();
      friend.updated = Date.now();
      await user.save();
      await friend.save();
    }

    return res.json({
      message: "Connected",
      connections: user.connections,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listConnections = async (req, res) => {
  try {
    if (!req.auth || String(req.profile._id) !== String(req.auth._id)) {
      return res.status(403).json({ error: "User is not authorized" });
    }

    const user = await User.findById(req.profile._id)
      .populate(
        "connections",
        "name email program studentNumber origin profilePhoto"
      )
      .select("connections");

    return res.json(user?.connections || []);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  removeAll,
  connect,
  listConnections,
};
