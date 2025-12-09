const express = require("express");
const controller = require("./auth.controller");

const Router = express.Router();

Router.route("/signIn").post(controller.signIn);
Router.route("/LogIn").post(controller.LogIn);
Router.route("/LogOut").post(controller.Protect , controller.LogOut);

Router.route("/forgetPassword").post(controller.forgetPassword);
Router.route("/resetPassword/:token").patch(controller.resetPassword);

Router.route("/updatePassword").patch(
  controller.Protect,
  controller.updatePassword
);

module.exports = Router;
