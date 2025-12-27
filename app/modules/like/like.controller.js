const Like = require("./like.model");
const catchAsync = require("../../utils/catchAsync");
const AppErorr = require("../../utils/appError");

const modelsMap = {
  Comment: require("../comment/comment.model"),
  Report: require("../reports/report.model"),
};

exports.likeAndUnLike = catchAsync(async (req, res, next) => {
  const { targetType, targetId } = req.params;
  const userId = req.user._id;

  const Model = modelsMap[targetType];
  console.log("first", Model);
  if (!Model) {
    return next(new AppErorr("Invalid targetType", 400));
  }

  const like = await Like.findOne({
    userId,
    targetType,
    targetId,
  });

  if (like) {
    const result = await Like.deleteOne({ userId, targetType, targetId });

    if (result.deletedCount === 1) {
      await Model.findByIdAndUpdate(
        targetId,
        { $inc: { like: -1 } },
        { new: true }
      );
    }

    return res.status(200).json({
      status: "success",
      message: "UnLiked Successfully",
    });
  } else {
    const result = await Like.create({ userId, targetType, targetId });

    if (result) {
      await Model.findByIdAndUpdate(
        targetId,
        { $inc: { like: +1 } },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Liked Successfully",
    });
  }
});
