const fs = require("fs");

const reports = JSON.parse(fs.readFileSync(`${__dirname}/reportlist.json`));

exports.getReport = (req, res) => {
  res.status(200).json({
    status: "success",
    results: reports.length,
    data: {
      reports,
    },
  });
};

exports.getReportById = (req, res) => {
  const {id} = req.params;
  const report = reports.find((report) => report.id == id);

  if (!report) {
    res.status(404).json({
      status: "fail",
      message: "Report not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        report,
      },
    });
  }
};
