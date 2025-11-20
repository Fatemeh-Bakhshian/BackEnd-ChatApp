const express = require("express");

const router = express.Router();

const controller = require("./user.controller");
const authController = require("../authenticate/auth.controller");

router.route("/").get(controller.getUsers);

router.patch(
  "/updateProfile",
  authController.Protect,
  controller.updateProfile
);

module.exports = router;
