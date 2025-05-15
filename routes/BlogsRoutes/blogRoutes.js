const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/UploadBlogCoverImageMiddleware");
const User = require("../../models/userSchema");

const Blog = require("../../models/Blogs");
const createAlgoliaIndex = require("../../utils/algolia");

router.post("/", authMiddleware, async (req, res) => {
  const { title, content, tags, publish, coverImage } = req.body;
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
      coverImage: coverImage || "",
      tags: processedTags,
      published: publish ?? false,
      author: user._id,
    });
    await newBlog.save();
    await newBlog.populate("author", "name");
    console.log(newBlog);

    if (publish) {
      res.status(200).json({ message: "successfully Publish", blog: newBlog });
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
    const { authorization } = req.headers;

    // const singleBlog = await Blog.findOneAndUpdate(
    //   { slug },
    //   { $inc: { views: 1 } },
    //   { new: true }
    // ).populate("author");

    const singleBlog = await Blog.findOne({ slug }).populate("author");

    if (!singleBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    singleBlog.views += 1;
    let userId = null;
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log("Invalid token:", err.message);
      }
    }
    const ipHeader = req.headers["x-forwarded-for"];
    const ip = ipHeader
      ? ipHeader.split(",")[0].trim()
      : req.socket.remoteAddress;

    singleBlog.viewsLog.push({
      userId,
      viewedAt: new Date(),
      ip: userId ? null : ip,
    });

    await singleBlog.save();

    res.status(200).json(singleBlog);
  } catch (error) {
    res.status(500).json({ message: "error reading blogs", error });
  }
});
router.put("/:slug", authMiddleware, async (req, res) => {
  const { slug } = req.params;
  const { title, content, tags, publish, coverImage } = req.body;

  if (!slug) return res.status(400).json({ message: "Slug Required" });

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
    const updateBlog = await Blog.findOneAndUpdate(
      { slug: slug },
      {
        title,
        content,
        coverImage,
        tags: processedTags,
        publish: publish ?? false,
      },
      { new: true }
    );

    res.status(200).json({ message: "blog is updated", blog: updateBlog });
  } catch (err) {
    res
      .status(500)
      .json({ message: "error updating blog", error: err.message });
  }
});

module.exports = router;
