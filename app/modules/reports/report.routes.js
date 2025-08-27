const express = require("express");

const router = express.Router();

const controller = require("./report.controller");

router.route('/').get(controller.getReport);

module.exports = router;
