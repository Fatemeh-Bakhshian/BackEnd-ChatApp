const Report = require("./report.model");

exports.getReport = async (req, res) => {
  try {
    const reports = await Report.find();

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
