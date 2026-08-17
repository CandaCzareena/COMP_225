import express from "express";
import schoolCtrl from "../controllers/school.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/schools")
  .get(schoolCtrl.list)
  .post(authCtrl.requireSignin, schoolCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, schoolCtrl.removeAll);

router.param("schoolId", schoolCtrl.schoolByID);

router
  .route("/api/schools/:schoolId")
  .get(schoolCtrl.read)
  .put(authCtrl.requireSignin, schoolCtrl.update)
  .delete(authCtrl.requireSignin, schoolCtrl.remove);

export default router;
