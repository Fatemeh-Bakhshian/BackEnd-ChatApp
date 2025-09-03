const express = require("express");

const router = express.Router();

const controller = require("./report.controller");
const middleware = require("./report.middleware");
const Schema = require("./report.schema");

router.route("/").get(controller.getReport);
router
  .route("/:id")
  .get(middleware.validateReportId(Schema.reportIdSchema), controller.getReportById);

module.exports = router;
