import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/api/users").post(userCtrl.create);
router.route("/api/users").get(userCtrl.list);
router
  .route("/api/users")
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, userCtrl.removeAll);

router
  .route("/api/users/:userId/connections")
  .get(authCtrl.requireSignin, userCtrl.listConnections);

router
  .route("/api/users/:userId/connect")
  .post(authCtrl.requireSignin, userCtrl.connect);

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
