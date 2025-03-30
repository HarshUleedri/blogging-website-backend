const express = require("express");

const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/UploadBlogCoverImageMiddleware");
const User = require("../../models/userSchema");

const Blog = require("../../models/Blogs");

router.post("/", authMiddleware, async (req, res) => {
  const { title, content, tags, publish, imageUrl } = req.body;
  const { id } = req.user;

  if (!id) return res.status(404).json({ message: "User Id Not Found " });

  const user = await User.findOne({ _id: id });

  if (!user) return res.status(404).json({ message: "User  Not Found " });

  //For Tags

  const processedTags = tags
    ? [
        ...new Set(
          tags.map((item) => ({
            tag: item.tag.toLowerCase().trim(),
            color: item.color,
          }))
        ),
      ]
    : [];
  try {
    const newBlog = new Blog({
      title: title,
      content: content,
      coverImage: imageUrl,
      tags: processedTags,
      published: publish ?? false,
      author: user._id,
    });
    await newBlog.save();
    if (publish) {
      setTimeout(() => {
        res
          .status(200)
          .json({ message: "successfully Publish", blog: newBlog });
      }, 2000);
      return;
    }
    return res
      .status(200)
      .json({ message: "successfully Draft ", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error); // Logs full error details
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author");
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
    const singleBlog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author");
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
