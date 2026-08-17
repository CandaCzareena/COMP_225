import express from "express";
import blogCtrl from "../controllers/blog.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/blogs")
  .get(blogCtrl.list)
  .post(authCtrl.requireSignin, blogCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, blogCtrl.removeAll);

router.param("blogId", blogCtrl.blogByID);

router
  .route("/api/blogs/:blogId")
  .get(blogCtrl.read)
  .put(authCtrl.requireSignin, blogCtrl.update)
  .delete(authCtrl.requireSignin, blogCtrl.remove);

export default router;
