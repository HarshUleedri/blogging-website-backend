const express = require("express");
const { getUserFollowers } = require("../../controllers/Userfollow/UserFollow");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getUserFollowers);

module.exports = router;
