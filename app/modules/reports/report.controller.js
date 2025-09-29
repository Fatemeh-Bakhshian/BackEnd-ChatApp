const APIFeatures = require("../../utils/apiFeatures");
const Report = require("./report.model");

exports.aliasTopReports = (req, res, next) => {
  req.query.limit = "2";
  req.query.sort = "-date,like";
  req.query.fields = "name,like,date";
  console.log("0 => ", req.query);
  next();
};

exports.getReport = async (req, res) => {
  try {
    const features = new APIFeatures(Report.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginat();

    const reports = await features.query;

    res.status(200).json({
      status: "success",
      results: reports.length,
      data: {
        reports,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        report,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
