const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const { getUserFollowers } = require("../../controllers/userfollow/userFollow");
const router = express.Router();

router.get("/", authMiddleware, getUserFollowers);

module.exports = router;
