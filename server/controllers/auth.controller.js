import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "./../../config/config.js";

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "student",
  studentNumber: user.studentNumber,
  program: user.program,
  origin: user.origin,
  profilePhoto: user.profilePhoto || "",
});

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match." });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role || "student" },
      config.jwtSecret
    );
    res.cookie("t", token, { expire: new Date() + 9999 });
    return res.json({
      token,
      user: publicUser(user),
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "signed out",
  });
};

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const isOwner =
    req.profile &&
    req.auth &&
    String(req.profile._id) === String(req.auth._id);
  const isAdmin = req.auth && req.auth.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.auth?._id) {
      return res.status(401).json({ error: "Sign in required" });
    }
    const user = await User.findById(req.auth._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.adminUser = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Admin access required" });
  }
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  requireAdmin,
  publicUser,
};
