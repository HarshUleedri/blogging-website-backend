const express = require("express");
const {
  getTotalComments,
} = require("../../controllers/analytics/getTotalCommentsControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getTotalComments);

module.exports = router;
