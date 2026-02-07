const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "a title is required for comment"],
      uniqe: true,
      trim: true,
      max: [10, "title is too long, it should be less than 10 character!"],
    },
    comment: {
      type: String,
      required: [true, "you cant send an empty comment!"],
      trim: true,
      min: [10, "title is too short, it should be more than 10 character!"],
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: [true, "You need to specify the reportId!"],
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "writerId is required"],
    },
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true, // it will Add (CreatAt) and (Update) Add and the update one will change every time that we update a comment
  },
);

// populating writer
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "writer",
    select: "-__v",
  });

  next();
});

commentSchema.index({ createdAt: -1 });
commentSchema.index({ reportId: -1 });
commentSchema.index({ title: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
