const Blog = require("../../models/Blogs");

exports.searchBlog = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json("Search query is required");
    }


    const blogs = await Blog.find(
      { $text: { $search: q }, published: true },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore", createdAt: -1 } })
      .populate("author", "-password");
    if (!blogs) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
