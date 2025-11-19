const express = require("express");
const controller = require("./auth.controller");

const Router = express.Router();

Router.route("/signIn").post(controller.signIn);
Router.route("/LogIn").post(controller.LogIn);
Router.route("/forgetPassword").post(controller.forgetPassword);
Router.route("/resetPassword/:token").patch(controller.resetPassword);

module.exports = Router;
