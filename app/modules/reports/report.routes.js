const express = require("express");

const router = express.Router();

const reportController = require("./report.controller");
const authController = require("../authenticate/auth.controller");
// const middleware = require("./report.middleware");
// const Schema = require("./report.model");

router
  .route("/")
  .get(reportController.getReport)
  .post(authController.Protect, reportController.postReport);

router.get(
  "/top-2-new",
  reportController.aliasTopReports,
  reportController.getReport
);

router
  .route("/:id")
  .get(authController.Protect, reportController.getReportById)
  .patch(authController.Protect, reportController.editeReport)
  .delete(authController.Protect, reportController.deleteReport);


//router
//   .route("/:id")
//   .get(middleware.validateReportId(Schema.reportIdSchema), controller.getReportById);

module.exports = router;
