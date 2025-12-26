const express = require("express");

const router = express.Router();

const commentController = require("./comment.controller");
const authController = require("../authenticate/auth.controller");

router.get(
  "/",
  authController.Protect,
  authController.restricTo("Admin"),
  commentController.getAllComments
);
router.get(
  "/userComment",
  authController.Protect,
  commentController.getUserComments
);

router
  .route("/:reportId")
  .post(authController.Protect, commentController.postComment)
  .get(commentController.getReportComments);

router
  .route("/:id")
  .delete(authController.Protect, commentController.deleteComment)
  .patch(authController.Protect, commentController.editeComment);

module.exports = router;
