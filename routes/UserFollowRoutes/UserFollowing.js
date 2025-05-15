const express = require("express");
const {
  getUserFollowings,
} = require("../../controllers/Userfollow/UserFollow");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getUserFollowings);

module.exports = router;
