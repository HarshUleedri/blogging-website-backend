const express = require("express");

const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/UploadBlogCoverImageMiddleware");
const User = require("../../models/userSchema");

const Blog = require("../../models/Blogs");

router.post(
  "/",
  authMiddleware,
  upload.single("coverImage"),
  async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.user;

    const user = await User.findOne({ _id: id });

    let imageUrl;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/blog-cover-image/${req.file.filename}`;
    } else {
      imageUrl = "";
    }

    try {
      const newBlog = new Blog({
        title: title,
        content: content,
        coverImage: imageUrl,
        author: id,
      });
      await newBlog.save();
      res.status(200).json(newBlog);
    } catch (error) {
      res.status(500).json({ message: "error creating blog", error });
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find().populate("author");
    if (!allBlogs) {
      return res.status(404).json({ message: "blog not found" });
    }
    res.status(200).json(allBlogs);
  } catch (error) {
    res.status(500).send.json({ message: "error reading blogs", error });
  }
});
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const singleBlog = await Blog.findOne({ slug }).populate("author");
    if (!singleBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(singleBlog);
  } catch (error) {
    res.status(500).json({ message: "error reading blogs", error });
  }
});
router.put("/:slug", async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;
  try {
    const updateBlog = await Blog.findOneAndUpdate(
      { slug: slug },
      { title, content },
      { new: true }
    );

    res.status(200).json({ message: "blog is updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "error updating blog", error: err.message });
  }
});

module.exports = router;
