const User = require("../../models/userSchema");
const Comments = require("../../models/Comments");

exports.addComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text, parentId } = req.body;
    const { id } = req.user;

    if (!blogId) res.status(404).json({ message: " Blog Not Found " });

    if (!id) res.status(404).json({ message: " User Not Found " });

    const user = await User.findOne({ _id: id });
    if (!user) res.status(404).json({ message: "User Not Found" });

    if (!text) res.status(404).json({ message: " text Not found" });

    const comments = new Comments({
      blogId,
      userId: user._id,
      text,
      parentId,
    });
    await comments.save();

    res.status(200).json({ message: "working" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
