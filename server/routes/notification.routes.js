import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import notificationCtrl from "../controllers/notification.controller.js";

const router = express.Router();

router
  .route("/api/notifications")
  .get(authCtrl.requireSignin, notificationCtrl.list);

router
  .route("/api/notifications/read-all")
  .put(authCtrl.requireSignin, notificationCtrl.markAllRead);

router
  .route("/api/notifications/:notificationId/read")
  .put(authCtrl.requireSignin, notificationCtrl.markRead);

export default router;
