const express = require("express");

const router = express.Router();

const reportController = require("./report.controller");
const authController = require("../authenticate/auth.controller");
// const middleware = require("./report.middleware");
// const Schema = require("./report.model");

router.route("/").get(reportController.getReport);

router
  .route("/top-2-new")
  .get(reportController.aliasTopReports, reportController.getReport);

router
  .route("/:id")
  .get(authController.Protect, reportController.getReportById);

//router
//   .route("/:id")
//   .get(middleware.validateReportId(Schema.reportIdSchema), controller.getReportById);

module.exports = router;
