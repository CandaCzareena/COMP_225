import express from "express";
import programCtrl from "../controllers/program.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/programs")
  .get(programCtrl.list)
  .post(authCtrl.requireSignin, programCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, programCtrl.removeAll);

router.param("programId", programCtrl.programByID);

router
  .route("/api/programs/:programId")
  .get(programCtrl.read)
  .put(authCtrl.requireSignin, programCtrl.update)
  .delete(authCtrl.requireSignin, programCtrl.remove);

export default router;
