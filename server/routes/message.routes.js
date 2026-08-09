import express from "express";
import messageCtrl from "../controllers/message.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/messages")
  .get(authCtrl.requireSignin, messageCtrl.listConversations)
  .post(authCtrl.requireSignin, messageCtrl.create);

router
  .route("/api/messages/:userId")
  .get(authCtrl.requireSignin, messageCtrl.listWithUser);

export default router;
