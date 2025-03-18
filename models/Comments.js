const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const comments = moongoose.Schema(
  {
    blogId: { type: moongoose.Schema.ObjectId, ref: "Blog" },
    userId: { type: moongoose.Schema.ObjectId, ref: "users" },
    text: { type: String, require: true },
    parentId: {
      type: moongoose.Schema.ObjectId,
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
