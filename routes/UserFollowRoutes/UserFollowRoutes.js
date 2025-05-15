const express = require("express");
const { userFollowToggle } = require("../../controllers/Userfollow/UserFollow");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, userFollowToggle);

module.exports = router;
