const APIFeatures = require("../../utils/apiFeatures");
const Report = require("./report.model");
const catchAsync = require("../../utils/catchAsync");
const AppErorr = require("../../utils/appError");

exports.aliasTopReports = (req, res, next) => {
  req.myQuery = {
    ...req.query,
    limit: "2",
    sort: "-date,-like",
    fields: "title,like,date",
  };

  next();
};

exports.getReport = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Report.find(),
    req.myQuery ? req.myQuery : req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginat();

  let reports = await features.query;
  console.log(reports);

  res.status(200).json({
    status: "success",
    results: reports.length,
    data: {
      reports,
    },
  });
});

exports.getReportById = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  //reza added this if part :
  if (!report) {
    return next(new AppErorr("Report not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});

//--------------------------------------------------------------------------------------------
