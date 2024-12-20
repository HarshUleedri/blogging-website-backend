const express = require("express");

const router = express.Router();

const Blog = require("../models/Blogs");

router.post("/", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    newBlog = new Blog({
      title: title,
      content: content,
      author: author,
    });
    await newBlog.save();
    res.status(200).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "error creating blog", error });
  }
});
router.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find();
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
    const singleBlog = await Blog.findOne({ slug });
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
