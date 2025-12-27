const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A report should have a title"],
      unique: true,
      trim: true,
    },

    report: {
      type: String,
      required: [true, "A report should have a report body"],
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "writerId is required"],
    },
    writer: {
      type: String,
      required: [true, "A report should have a writer"],
      trim: true,
    },
    writerRole: { type: String, trim: true },
    writerProfile: { type: String, trim: true },
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ date: -1 });
reportSchema.index({ like: -1 });
reportSchema.index({ title: 1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
