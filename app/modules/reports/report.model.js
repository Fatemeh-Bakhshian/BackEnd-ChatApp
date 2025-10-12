// const { str } = require("ajv");
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A report should have a title"],
      //     unique: true,
      trim: true,
    },

    report: {
      type: String,
      required: [true, "A report should have a report body"],
    },

    //   writer: {
    //     type: String,
    //     required: [true, "A report should have a writer"],
    //   },

    writer: {
      type: String,
      required: [true, "A report should have a writer"],
      trim: true,
    },

    //   writerrol: String,
    writerRole: { type: String, trim: true },

    //   writerprofile: String,
    writerProfile: { type: String, trim: true },

    //   date: String,
    date: {
      type: Date, //
      default: Date.now,
    },

    //   comment: [Object],
    comment: [
      {
        user: { type: String, trim: true },
        text: { type: String, trim: true },
        date: { type: Date, default: Date.now },
      },
    ],

    //   like: Number,
    like: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

reportSchema.index({ date: -1 });
reportSchema.index({ like: -1 });
reportSchema.index({ title: 1 });

module.exports = Report;

// exports.reportIdSchema = {
//   type: "object",
//   properties: {
//     id: { type: "integer" },
//   },
//   required: ["id"],
//   additionalProperties: false,
// };

//------------------------------------------------------------------------------

// const mongoose = require("mongoose");

// const reportSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "A report should have a title"],
//       unique: true,
//       trim: true,
//     },
//     report: {
//       type: String,
//       required: [true, "A report should have a body"],
//     },
//     writer: {
//       type: String,
//       required: [true, "A report should have a writer"],
//       trim: true,
//     },
//     writerRole: { type: String, trim: true },
//     writerProfile: { type: String, trim: true },
//     date: {
//       type: Date, //
//       default: Date.now,
//     },
//     comment: [
//       {
//         user: { type: String, trim: true },
//         text: { type: String, trim: true },
//         date: { type: Date, default: Date.now },
//       },
//     ],
//     like: { type: Number, default: 0, min: 0 },
//   },
//   {
//     timestamps: true,
//   }
// );

// reportSchema.index({ date: -1 });
// reportSchema.index({ like: -1 });
// reportSchema.index({ title: 1 });

// const Report = mongoose.model("Report", reportSchema);
// module.exports = Report;
