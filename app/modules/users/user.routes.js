const express = require("express");

const router = express.Router();

const controller = require("./user.controller");
const authController = require("../authenticate/auth.controller");

router.route("/").get( authController.Protect , authController.restricTo("Admin") ,controller.getUsers);

router.patch(
  "/updateProfile",
  authController.Protect,
  controller.updateProfile
);

router.delete(
  "/deleteAccount",
  authController.Protect,
  controller.deleteAccount
);

module.exports = router;
