const User = require("../../models/userSchema");
const Blog = require("../../models/Blogs");
const Comments = require("../../models/Comments");

exports.getAllBlogsComments = async (req, res) => {
  try {

    const { id } = req.user;

    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json({ message: "User Not Found" });

    const blogs = await Blog.find({ author: user._id });

    const comments = await Promise.all(
      blogs.map(async (blog) => {
        const comment = await Comments.find({ blogId: blog._id });
        return comment;
      })
    );

    res.status(200).json({ comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};
