const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const {
  getUserFollowings,
} = require("../../controllers/userfollow/userFollow");
const router = express.Router();

router.get("/", authMiddleware, getUserFollowings);

module.exports = router;
