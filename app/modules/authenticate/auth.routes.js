const express = require("express");
const controller = require("./auth.controller");

const Router = express.Router();

Router.route("/signIn").post(controller.signIn);
Router.route("/LogIn").post(controller.LogIn);

module.exports = Router;
