const Comments = require("../../models/Comments");

exports.getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) return res.status(404).json({ message: "Blog Not found" });

    const comments = await Comments.find({ slug: blogId }).populate(
      "userId",
      "username"
    );

    if (!comments)
      return res.status(404).json({ message: " Comments Not Found" });

    const commentsMap = {};

    comments.forEach((comment) => {
      commentsMap[comment._id] = { ...comment, replies: [] };
    });

    topLevelComments = [];

    comments.forEach((comment) => {
      if (comment.parentId) {
        if (commentsMap[comment.parentId]) {
          commentsMap[comment.parentId].replies.push(commentsMap[comment._id]);
        }
      } else {
        topLevelComments.push(commentsMap[comment._id]);
      }
    });

    res.status(200).json({ topLevelComments });
  } catch (err) {
    res.status(500).json({ message: " server error" });
  }
};
