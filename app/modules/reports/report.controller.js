const APIFeatures = require("../../utils/apiFeatures");
const Report = require("./report.model");
const catchAsync = require("../../utils/catchAsync");
const AppErorr = require("../../utils/appError");
const Comment = require("../comment/comment.model");
const Like = require("../like/like.model");

exports.aliasTopReports = (req, res, next) => {
  req.myQuery = {
    ...req.query,
    limit: "4",
    sort: "-date,-like",
  };

  next();
};

const editefildes = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  console.log("MY NEW OBJ for report => ", newObj);

  return newObj;
};

exports.getReport = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Report.find(),
    req.myQuery ? req.myQuery : req.query,
  )
    .Cfilter()
    .search()
    .sort()
    .limitFields()
    .paginat();

  let reports = await features.query;
  // console.log(reports);

  res.status(200).json({
    status: "success",
    results: (await Report.find()).length,
    data: {
      reports,
    },
  });
});

exports.getReportById = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

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

exports.getReportByWriterId = catchAsync(async (req, res, next) => {
  const reports = await Report.find({
    writerId: req.params.writerId,
  });

  if (!reports) {
    return next(new AppErorr("Report not found", 404));
  }

  if (reports.length === 0) {
    return next(new AppErorr("this user hase no report yet", 200));
  }

  res.status(200).json({
    status: "success",
    results: reports.length,
    data: {
      reports,
    },
  });
});

exports.postReport = catchAsync(async (req, res, next) => {
  const report = await Report.create({
    title: req.body.title,
    report: req.body.report,
    writer: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      report,
    },
  });
});

exports.editeReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  console.log("report------------------------------------", report);
  if (report.writerId.toString() !== req.user._id.toString()) {
    return next(
      new AppErorr("this is not your report, you can't edite it.", 403),
    );
  }

  const newfileds = editefildes(req.body, "title", "report");

  const updatereport = await Report.findByIdAndUpdate(
    req.params.id,
    newfileds,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: "success",
    data: {
      report: updatereport,
    },
  });
});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppErorr("report not found", 404));
  }

  if (report.writer._id.toString() !== req.user._id.toString()) {
    return next(
      new AppErorr("this is not your report, you can't delete it.", 403),
    );
  }

  const reportsComment = await Comment.find({ report: req.params.id }).select(
    "_id",
  );

  // for deleting the comments of this report
  await Like.deleteMany({ targetType: "Report", targetId: req.params.id });

  await Like.deleteMany({
    targetType: "Comment",
    targetId: reportsComment.map((c) => c._id),
  });

  await Comment.deleteMany({ report: req.params.id });

  await Report.deleteOne({ _id: req.params.id });

  res.status(204).json({
    status: "success",
    message: "report deleted.",
  });
});
