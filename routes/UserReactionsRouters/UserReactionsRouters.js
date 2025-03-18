const express = require("express");

const router = express.Router();

const User = require("../../models/userSchema");
const Blog = require("../../models/Blogs");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/:slug/reaction", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { reactionType } = req.body;
    const { id } = req.user;

    const blog = await Blog.findOne({ slug });
    const user = await User.findOne({ _id: id });

    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const userReacted = blog.userReacted.find(
      (reacted) => reacted._id.toString() === user._id.toString()
    );
    if (userReacted) {
      if (userReacted.reactionType === reactionType) {
        blog.userReacted = blog.userReacted.filter(
          (reacted) => reacted._id.toString() !== user._id.toString()
        );
        await blog.save();
        blog.reactions[userReacted.reactionType] -= 1;
        await blog.save();
      } else {
        blog.reactions[reactionType] += 1;
        blog.reactions[userReacted.reactionType] -= 1;
        userReacted.reactionType = reactionType;
        await blog.save();
      }
      // return res.status(200).json({ message: "user Id add successfully" });
    } else {
      blog.userReacted.push({ _id: user._id, reactionType });
      blog.reactions[reactionType] += 1;
      await blog.save();
      // return res.status(200).json({ message: "user Id removed successfully" });
    }

    return res.status(200);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});


router.get("/:slug/reactions", async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      res.status(404).json({ message: "Blog Not Found" });
    }

    return res.status(200).json(blog.reactions);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
