const express = require("express");
const {
  getTotalReaction,
} = require("../../controllers/analytics/getTotalReaction");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getTotalReaction);

module.exports = router;
