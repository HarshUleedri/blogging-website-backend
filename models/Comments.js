const mongoose = require("mongoose");

const comments = mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.ObjectId, ref: "Blog" },
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    text: { type: String, require: true },
    parentId: {
      type: mongoose.Schema.ObjectId,
      ref: "comments",
      default: null,
    },
    reactions: {
      like: { type: Number, default: 0 },
      clap: { type: Number, default: 0 },
      explodingHead: { type: Number, default: 0 },
    },
    userReacted: [{ userId: mongoose.Schema.ObjectId, reactionType: String }],
  },
  { timestamps: true }
);

const Comments = mongoose.model("comments", comments);

module.exports = Comments;
