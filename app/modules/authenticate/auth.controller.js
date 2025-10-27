const { promisify } = require("util");
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");

const SignToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN,
  });
};

exports.signIn = async (req, res, next) => {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    passwordConfrim: req.body.passwordConfrim,
  });

  const token = SignToken(newuser._id);
  try {
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newuser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
};

exports.LogIn = async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      status: "Invalid data sent",
      message: "please provide email and password! ",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.CorrectPassword(password, user.password))) {
    if (!password || !email) {
      return res.status(401).json({
        status: "Invalid data sent",
        message: " incorrect email or password ",
      });
    }
  }

  const token = SignToken(user._id);

  try {
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
};

exports.Protect = async (req, res, next) => {
  // 1) get token and check if its there

  // A : get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // B : if its there
  if (!token) {
    return res.status(401).json({
      status: "Invalid data sent",
      message: "pls logIn to get access!",
    });
  }

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("process.env.JWT_SECRET =>", decoded);

  // 3) check if user still exists

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return res.status(401).json({
      status: "Invalid data sent",
      message: "user is not defind",
    });
  }

  // 4) check if user changed password after the token was issued

  if (freshUser.changedPasswordAfter(decoded.iat) == true) {
    console.log("my own test => ", freshUser.changedPasswordAfter(decoded.iat));
    return res.status(401).json({
      status: "Invalid data sent",
      message: "user changed the pass pls logIn again",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUT
  req.user = freshUser;
  next();
};
