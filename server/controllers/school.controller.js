import School from "../models/school.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
const create = async (req, res) => {
  const school = new School(req.body);
  try {
    await school.save();
    return res.status(200).json({
      message: "School Created",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let schools = await School.find().select("schoolname campus description");
    res.json(schools);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const schoolByID = async (req, res, next, id) => {
  try {
    let school = await Schol.findById(id);
    if (!school)
      return res.status(400).json({
        error: "School not found",
      });
    req.profile = school;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve school",
    });
  }
};
const read = (req, res) => {
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let school = req.profile;
    school = extend(school, req.body);
    school.updated = Date.now();
    await school.save();
    res.json(school);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let school = req.profile;
    let deletedSchool = await school.deleteOne();
    return res.status(200).json({
        message: "School deleted"
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await School.deleteMany({});

    return res.status(200).json({
      message: `${result.deletedCount} schools deleted`
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, schoolByID, read, list, remove, update, removeAll };