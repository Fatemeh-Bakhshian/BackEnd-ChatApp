const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "please provaide your name"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "a user must have a role"],
    enum: ["Admin", "User"],
    trim: true,
    default: "User",
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
    // required: [true, "please provaide your phonenumber"],
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

  activate: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// pre save middleware:

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfrim = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  return (this.passwordChangedAt = Date.now - 1000);
  next();
});

// set the user name for signIn
userSchema.pre("save", async function (next) {
  if (!this.name && this.email) {
    this.name = this.email.split("@")[0];
  }
  next();
});

// query middleware :

userSchema.pre(/^find/, function (next) {
  this.find({ activate: { $ne: false } });

  next();
});

// INSTANTS METODS:

userSchema.methods.CorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(
    "first : ",
    await bcrypt.compare(candidatePassword, userPassword)
  );
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

userSchema.methods.ceartePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // console.log("MY RESET TOKEN", resetToken);

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log("MY HASHED RESET TOKEN", this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
