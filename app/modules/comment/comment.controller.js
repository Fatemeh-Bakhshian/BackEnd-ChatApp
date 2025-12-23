const APIFeatures = require("../../utils/apiFeatures");
const AppErorr = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Comment = require("./comment.model");

//get all ==> for a report / for a writer / all as admin

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

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

// edite comment by writer



// delete comment => admin and writer

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.writerId.toString() !== req.user._id.toString()) {
    return next(
      new AppErorr("this is not your comment, you can't delete it.", 403)
    );
  }

  await Comment.deleteOne({ _id: req.params.id });

  res.status(201).json({
    status: "success",
    message: "comment deleted.",
  });
});
