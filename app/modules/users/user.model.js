const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provaide your name"],
    trim: true,
  },
  roll: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is requaired"],
    unique: true,
    trim: true,
    validate: [validator.isEmail, "please provaide your email"],
  },
  phonenumber: {
    type: String,
    required: [true, "please provaide your phonenumber"],
    trim: true,
  },
  birthdate: { type: Date },
  profile: {
    type: String,
  },
  password: {
    type: String,
    required: [true, " please provaide a password "],
    minlength: 8,
    select: false,
  },
  passwordConfrim: {
    type: String,
    required: [true, " please provaide a password "],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    select: false,
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfrim = undefined;
  next();
});

userSchema.methods.CorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = async function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changeTimeStamp;
  }

  // fals means not changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
