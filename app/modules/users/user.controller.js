const User = require("./user.model");
const catchAsync = require("../../utils/catchAsync");
const AppErorr = require("../../utils/appError");

const fillterFields = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  console.log("MY NEW OBJ", newObj);

  return newObj;
};

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfrim) {
    return next(
      new AppErorr(
        "you cant change your password here please use '/updatePassword' ",
        400
      )
    );
  }

  const UpdateFields = fillterFields(
    req.body,
    "name",
    "email",
    "phonenumber",
    "birthdate"
  );
  const updatedUser = await User.findByIdAndUpdate(req.user._id, UpdateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { activate: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
