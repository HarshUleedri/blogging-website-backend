const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const User = require("../../models/userSchema");
const Blog = require("../../models/Blogs");

const router = express.Router();

router.get("/bookmark", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(404).json({ message: "user id not found" });
    }
    const user = await User.findOne({ _id: id }).populate("bookmarks");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/:slug/bookmark", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    const { slug } = req.params;

    const user = await User.findOne({ _id: id });

    const blog = await Blog.findOne({ slug });

    if (!user) return res.status(404).json({ message: "user not found" });

    if (!blog) return res.status(404).json({ message: "blog not found" });

    const isBookmarked = user.bookmarks.some(
      (bookmarkId) => bookmarkId.toString() === blog._id.toString()
    );

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== blog._id.toString()
      );
      await user.save();

      return res.json({ bookmarked: false });
    } else {
      user.bookmarks.push(blog._id);
      await user.save();

      return res.json({ bookmarked: true });
    }
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
