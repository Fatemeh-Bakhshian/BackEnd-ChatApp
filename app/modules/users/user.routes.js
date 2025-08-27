const express = require("express");

const router = express.Router();

const controller = require("./user.controller");

router.route("/").get(controller.getUsers);

module.exports = router;
