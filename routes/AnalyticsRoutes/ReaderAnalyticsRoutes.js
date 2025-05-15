const express = require("express");
const {
  getTotalReaders,
} = require("../../controllers/analytics/getTotalReadersControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getTotalReaders);

module.exports = router;
