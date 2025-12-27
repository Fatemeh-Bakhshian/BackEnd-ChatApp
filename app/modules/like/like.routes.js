const express = require("express");

const router = express.Router();

const likeController = require("./like.controller");
const authController = require("../authenticate/auth.controller");

router.post(
  "/:targetType/:targetId",
  authController.Protect,
  likeController.likeAndUnLike
);

module.exports = router;
