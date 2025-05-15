const User = require("../../models/userSchema");
const Blog = require("../../models/Blogs");

exports.getUsersBlogs = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "Unauthorized user" });

    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json({ message: "User Not Found" });

    const blogs = await Blog.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author");

    if (!blogs) return res.status(404).json({ message: "blogs Not Found" });

    return res.status(200).json(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};


