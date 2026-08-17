import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/api/uploads",
  authCtrl.requireSignin,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const mediaType = req.file.mimetype.startsWith("video/")
      ? "video"
      : "image";
    return res.status(201).json({
      url: `/uploads/${req.file.filename}`,
      mediaType,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  }
);

export default router;
