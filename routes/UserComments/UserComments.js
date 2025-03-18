const express = require("express");
const Comments = require("../../models/Comments");
const {
  addComments,
} = require("../../controllers/comments/addCommentsControllers");
const {
  getComments,
} = require("../../controllers/comments/getCommentsController");

const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/:blogId", authMiddleware, addComments);
router.get("/:blogId", getComments);

module.exports = router;
