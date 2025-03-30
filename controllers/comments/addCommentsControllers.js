const User = require("../../models/userSchema");
const Comments = require("../../models/Comments");
const Blog = require("../../models/Blogs");

exports.addComments = async (req, res) => {
  try {
    const { blogSlug } = req.params;

    const { text, parentId } = req.body;

    const { id } = req.user;

    if (!blogSlug)
      return res.status(400).json({ message: " Blog Slug Is Required" });

    const blog = await Blog.findOne({ slug: blogSlug });
    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    if (!id) return res.status(404).json({ message: " User Not Found " });

    const user = await User.findOne({ _id: id });
    if (!user) res.status(404).json({ message: "User Not Found" });

    if (!text) return res.status(400).json({ message: " text Not found" });

    const comments = new Comments({
      blogId: blog._id,
      userId: user._id,
      text,
      parentId,
    });
    await comments.save();

    return res.status(200).json({ message: "working" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "server error" });
  }
};
