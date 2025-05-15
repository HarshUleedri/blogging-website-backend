const express = require("express");
const {
  searchBlog,
} = require("../../controllers/SearchController/SearchController");
const router = express.Router();

router.get("/", searchBlog);

module.exports = router;
