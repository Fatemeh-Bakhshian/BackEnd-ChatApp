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

const User = mongoose.model("User", userSchema);

module.exports = User;
