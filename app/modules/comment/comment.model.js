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
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "You need to specify the reportId!"],
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
    timestamps: true, // it will Add (CreatAt) and (Update) Add and the update one will change every time that we update a comment
  }
);

commentSchema.index({ createdAt: -1 });
commentSchema.index({ reportId: -1 });
commentSchema.index({ title: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
