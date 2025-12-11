const APIFeatures = require("../../utils/apiFeatures");
const Report = require("./report.model");
const catchAsync = require("../../utils/catchAsync");
const AppErorr = require("../../utils/appError");

exports.aliasTopReports = (req, res, next) => {
  req.myQuery = {
    ...req.query,
    limit: "3",
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
    .Cfilter()
    .search()
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

exports.postReport = catchAsync(async (req, res, next) => {
  const report = await Report.create({
    title: req.body.title,
    report: req.body.report,

    writerId: req.user._id,
    writer: req.user.name,
    writerrol: req.user.role,
    writerprofile: req.user.profile ? req.user.profile : null,
  });

  res.status(201).json({
    status: "success",
    data: {
      report,
    },
  });
});

exports.editeReport = catchAsync(async (req, res, next) => {});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (report.writerId.toString() !== req.user._id.toString()) {
    return next(
      new AppErorr("this is not your report, you can't delete it.", 403)
    );
  }

  await Report.deleteOne({ _id: req.params.id });

  res.status(201).json({
    status: "success",
    message: "report deleted.",
  });
});

//--------------------------------------------------------------------------------------------
