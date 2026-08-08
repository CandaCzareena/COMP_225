import Program from "../models/program.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
const create = async (req, res) => {
  const program = new Program(req.body);
  try {
    await program.save();
    return res.status(200).json({
      message: "Program Created",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    let programs = await Program.find().select("title type description");
    res.json(programs);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const programByID = async (req, res, next, id) => {
  try {
    let program = await Program.findById(id);
    if (!program)
      return res.status(400).json({
        error: "Program not found",
      });
    req.profile = program;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve program",
    });
  }
};
const read = (req, res) => {
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let program = req.profile;
    program = extend(program, req.body);
    program.updated = Date.now();
    await program.save();
    res.json(program);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let program = req.profile;
    let deletedProgram = await program.deleteOne();
    return res.status(200).json({
        message: "Program deleted"
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Program.deleteMany({});

    return res.status(200).json({
      message: `${result.deletedCount} programs deleted`
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, programByID, read, list, remove, update, removeAll };