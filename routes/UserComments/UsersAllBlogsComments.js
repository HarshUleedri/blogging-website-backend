const express = require("express");
const router = express.Router();
const {
  getAllBlogsComments,
} = require("../../controllers/comments/getAllBlogsCommentsControllers");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, getAllBlogsComments);

module.exports = router;
