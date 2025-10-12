const APIFeatures = require("../../utils/apiFeatures");
const Report = require("./report.model");

exports.aliasTopReports = (req, res, next) => {
  req.myQuery = {
    ...req.query,
    limit: "2",
    sort: "-date,-like",
    fields: "title,like,date",
  };

  next();
};

exports.getReport = async (req, res) => {
  try {
    const features = new APIFeatures(
      Report.find({}),
      req.myQuery ? req.myQuery : req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginat();

    let reports = await features.query;

    res.status(200).json({
      status: "success",
      results: reports.length,
      data: {
        reports,
      },
    });
  } catch (err) {
    //     res.status(404).json({
    res.status(500).json({
      status: "failed",
      //       message: err,
      message: err.message,
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    //reza added this if part :
    if (!report) {
      return res.status(404).json({
        status: "failed",
        message: "Report not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        report,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

//--------------------------------------------------------------------------------------------
