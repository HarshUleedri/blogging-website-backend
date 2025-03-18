const express = require("express");

const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

const {
  addCommentReaction,
} = require("../../controllers/comments/addCommentsReaction");

router.post("/:commentId", authMiddleware, addCommentReaction);

module.exports = router;
