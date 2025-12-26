const APIFeatures = require("../../utils/apiFeatures");
const AppErorr = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Report = require("../reports/report.model");
const Comment = require("./comment.model");

const editefildes = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  console.log("MY NEW OBJ for comment => ", newObj);

  return newObj;
};

//get all :

// all as admin

exports.getAllComments = catchAsync(async (req, res, next) => {
  const featureComments = new APIFeatures(Comment.find(), req.query)
    .Cfilter()
    .search()
    .sort()
    .limitFields()
    .paginat();

  let comments = await featureComments.query;
  //   console.log(comments);

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

// for a writer
exports.getUserComments = catchAsync(async (req, res, next) => {
  const featureComments = new APIFeatures(
    Comment.find({ writerId: req.user._id }),
    req.query
  )
    .Cfilter()
    .search()
    .sort()
    .limitFields()
    .paginat();

  let comments = await featureComments.query;

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

// for a report

exports.getReportComments = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.reportId);
  if (!report) {
    return next(new AppErorr("Report not found", 404));
  }
  const featureComments = new APIFeatures(
    Comment.find({ reportId: req.params.reportId }),
    req.query
  ).paginat();

  let comments = await featureComments.query;

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

// add comment

exports.postComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({
    title: req.body.title,
    comment: req.body.comment,
    reportId: req.params.reportId,

    writerId: req.user._id,
    writer: req.user.name,
    writerrol: req.user.role,
    writerprofile: req.user.profile ? req.user.profile : null,
  });

  if (!req.params.reportId) {
    return next(new AppErorr("report id is required!", 500));
  }

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

// edite comment by writer

exports.editeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppErorr("comment not found!", 404));
  }
  if (comment.writerId.toString() !== req.user._id.toString()) {
    return next(
      new AppErorr("this is not your comment you can not edite it", 403)
    );
  }

  const newfileds = editefildes(req.body, "title", "comment");

  const updatecomment = await Comment.findByIdAndUpdate(
    req.params.id,
    newfileds,
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      comment: updatecomment,
    },
  });
});

// delete comment => admin and writer

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (req.user.role === "Admin") {
    await Comment.deleteOne({ _id: req.params.id });
  } else if (comment.writerId.toString() !== req.user._id.toString()) {
    return next(
      new AppErorr("this is not your comment, you can't delete it.", 403)
    );
  } else {
    await Comment.deleteOne({ _id: req.params.id });
  }

  res.status(201).json({
    status: "success",
    message: "comment deleted.",
  });
});
