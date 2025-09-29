const express = require("express");

const router = express.Router();

const controller = require("./report.controller");
// const middleware = require("./report.middleware");
// const Schema = require("./report.model");

router.route("/").get(controller.getReport);

router
  .route("/top-2-new")
  .get(controller.aliasTopReports, controller.getReport);

router.route("/:id").get(controller.getReportById);

//router
//   .route("/:id")
//   .get(middleware.validateReportId(Schema.reportIdSchema), controller.getReportById);

module.exports = router;
