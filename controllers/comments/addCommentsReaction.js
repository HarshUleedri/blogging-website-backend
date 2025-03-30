const { json } = require("express");
const Comments = require("../../models/Comments");
const User = require("../../models/userSchema");

exports.addCommentReaction = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log(commentId);
    const { reactionType } = req.body;
    console.log(reactionType);
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "Id Is Required " });

    const user = await User.findOne({ _id: id });
    console.log(user);

    if (!commentId)
      return res.status(400).json({ message: "Comment Id Is Require " });

    const comment = await Comments.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "Comment is Not Found" });
    }

    const userReacted = comment.userReacted.find(
      (userReaction) => userReaction._id.toString() === user._id.toString()
    );

    if (userReacted) {
      if (userReacted.reactionType !== reactionType) {
        comment.reactions[reactionType] += 1;
        comment.reactions[userReacted.reactionType] -= 1;
        userReacted.reactionType = reactionType;

        await comment.save();
      } else {
        comment.reactions[reactionType] -= 1;
        comment.userReacted = comment.userReacted.filter(
          (Reacted) => Reacted._id.toString() !== user._id.toString()
        );
        await comment.save();
      }
    } else {
      comment.userReacted.push({ _id: user._id, reactionType });
      comment.reactions[reactionType] += 1;
      await comment.save();
    }

    res.status(200).json({ reactions: comment.reactions });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
