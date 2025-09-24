const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  roll: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  phonenumber: {
    required: true,
    type: String,
  },
  birthdate: { type: String },
  profile: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
