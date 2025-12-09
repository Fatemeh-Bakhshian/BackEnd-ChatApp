const crypto = require("crypto");

const { promisify } = require("util");
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/email");
const catchAsync = require("../../utils/catchAsync");
const AppErorr = require("../../utils/appError");

const SignToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN,
  });
};
const CreateSendToken = (user, statusCode, res) => {
  const token = SignToken(user._id);
  console.log("check my TOKEN = ", token);

  try {
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax", // یا 'Strict' بسته به نیاز‌ها
        maxAge: 60 * 60 * 1000,
      })
      .status(statusCode)
      .json({ status: "success", user });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
};

exports.signIn = catchAsync(async (req, res, next) => {
  const newuser = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfrim: req.body.passwordConfrim,
  });

  CreateSendToken(newuser, 201, res);
});

exports.LogIn = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return next(new AppErorr("please provide email and password! ", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.CorrectPassword(password, user.password))) {
    return next(new AppErorr(" incorrect email or password ", 401));
  }

  CreateSendToken(user, 200, res);
});

exports.Protect = catchAsync(async (req, res, next) => {
  // 1) get token and check if its there

  // A : get token
  let token;
  if (req.headers.cookie && req.headers.cookie.startsWith("token")) {
    token = req.headers.cookie.split("=")[1];
  }

  // B : if its there
  if (!token) {
    return next(new AppErorr("pls logIn to get access!", 401));

    // return res.status().json({
    //   status: "Invalid data sent",
    //   message: ,
    // });
  }

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("process.env.JWT_SECRET =>", decoded);

  // 3) check if user still exists

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppErorr("user is not defind", 401));

    // return res.status(401).json({
    //   status: "Invalid data sent",
    //   message: ,
    // });
  }

  // 4) check if user changed password after the token was issued

  if (freshUser.changedPasswordAfter(decoded.iat) == true) {
    console.log("my own test => ", freshUser.changedPasswordAfter(decoded.iat));
    return next(new AppErorr("user changed the pass pls logIn again", 401));

    // return res.status(401).json({
    //   status: "Invalid data sent",
    //   message: "user changed the pass pls logIn again",
    // });
  }

  // GRANT ACCESS TO PROTECTED ROUT
  req.user = freshUser;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "Invalid data sent",
        message: "you do not have permission to perform this action",
      });
    }
    next();
  };
};

// forget pass hase two step:

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppErorr("there is no user with email address", 404));
  }

  // generate random verify token
  const verifyToken = user.ceartePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send the verify token to user email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${verifyToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
  ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
  console.log(
    "message",
    message,
    "------------",
    user.email,
    "----------",
    verifyToken
  );

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    console.log("test the try");

    res.status(200).json({
      status: "success",
      message: " token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppErorr(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppErorr("there is no user with email address", 404));
  }

  console.log("user", req.body);
  user.password = req.body.password;
  user.passwordConfrim = req.body.passwordConfrim;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  CreateSendToken(user, 200, res);
});
// ----------

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user.CorrectPassword(req.body.currentPassword, user.password)) {
    return next(new AppError("incorrect confrimPassword", 401));
  }

  user.password = req.body.password;
  user.passwordConfrim = req.body.passwordConfrim;
  await user.save();

  CreateSendToken(user, 200, res);
});

// LogOut
exports.LogOut = catchAsync(async (req, res, nex) => {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: true, // فقط روی HTTPS
    // sameSite: "Strict", // یا 'Lax' بسته به نیاز‌ها
    maxAge: 60 * 60 * 1000,
  });

  res.json({ success: true, message: "Logged out" });
});
