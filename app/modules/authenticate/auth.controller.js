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
