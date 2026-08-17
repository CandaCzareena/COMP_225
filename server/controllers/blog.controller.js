import Blog from "../models/blog.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { notifyAllUsersExcept } from "../helpers/notify.js";

const create = async (req, res) => {
  const blog = new Blog(req.body);
  try {
    await blog.save();

    const actorId = req.auth?._id;
    const actorName = req.body.username || "Someone";
    try {
      await notifyAllUsersExcept(actorId, {
        actorId,
        actorName,
        type: "post",
        title: `${actorName} shared a new post`,
        body: (req.body.title || req.body.content || "").slice(0, 120),
        link: "home",
        meta: { blogId: String(blog._id) },
      });
    } catch (notifyErr) {
      console.error("Post notification failed:", notifyErr.message);
    }

    return res.status(200).json({
      message: "Blog Created",
      blog,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let blogs = await Blog.find().select(
      "title username posted content mediaUrl mediaType"
    );
    res.json(blogs);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const blogByID = async (req, res, next, id) => {
  try {
    let blog = await Blog.findById(id);
    if (!blog)
      return res.status(400).json({
        error: "Blog not found",
      });
    req.profile = blog;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve blog",
    });
  }
};
const read = (req, res) => {
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let blog = req.profile;
    blog = extend(blog, req.body);
    blog.updated = Date.now();
    await blog.save();
    res.json(blog);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let blog = req.profile;
    await blog.deleteOne();
    return res.status(200).json({
      message: "Blog deleted",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Blog.deleteMany({});

    return res.status(200).json({
      message: `${result.deletedCount} blogs deleted`,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, blogByID, read, list, remove, update, removeAll };
