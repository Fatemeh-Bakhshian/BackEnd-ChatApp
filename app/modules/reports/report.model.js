// const { str } = require("ajv");
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A report sould have a title"],
    unique: true,
  },
  report: {
    type: String,
    required: [true, "A report should have a report body"],
  },
  writer: {
    type: String,
    required: [true, "A report should have a writer"],
  },
  writerrol: String,
  writerprofile: String,
  date: String,
  comment: [Object],
  like: Number,
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;


// exports.reportIdSchema = {
//   type: "object",
//   properties: {
//     id: { type: "integer" },
//   },
//   required: ["id"],
//   additionalProperties: false,
// };
