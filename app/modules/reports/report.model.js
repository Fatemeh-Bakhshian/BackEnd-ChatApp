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
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "writerId is required"],
    },
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// populating writer
reportSchema.pre(/^find/, function (next) {
  console.log("just test this middelware");
  this.populate({
    path: "writer",
    select: "-__v",
  });

  next();
});

reportSchema.index({ date: -1 });
reportSchema.index({ like: -1 });
reportSchema.index({ title: 1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
