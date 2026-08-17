import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import adminCtrl from "../controllers/admin.controller.js";

const router = express.Router();
const adminOnly = [authCtrl.requireSignin, authCtrl.requireAdmin];

router
  .route("/api/admin/users")
  .get(...adminOnly, adminCtrl.listUsers)
  .post(...adminOnly, adminCtrl.createUser);

router
  .route("/api/admin/users/:userId")
  .put(...adminOnly, adminCtrl.updateUser)
  .delete(...adminOnly, adminCtrl.removeUser);

router
  .route("/api/admin/items")
  .get(...adminOnly, adminCtrl.listItems)
  .post(...adminOnly, adminCtrl.createItem);

router
  .route("/api/admin/items/:itemId")
  .delete(...adminOnly, adminCtrl.removeItem);

export default router;
