const express = require("express");
const router = express.Router();

router.get("/:userId", (req, res) => {
  console.log("working");
});

module.exports = router;
