const User = require("./user.model");

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

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfrim) {
    res.status(400).json({
      status: "failed",
      message:
        "you cant change your password here please use '/updatePassword' ",
    });
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

  try {
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      statuse: "failed",
      message: err,
    });
  }
};

exports.deleteAccount = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { activate: false });

  try {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err,
    });
  }
};
