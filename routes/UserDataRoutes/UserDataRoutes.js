const express = require("express");
const {
  getUserData,
  postUserData,
} = require("../../controllers/userDataControllers/userDataControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const { getUsersBlogs } = require("../../controllers/userBlogs/userBlog");
const router = express.Router();

router.get("/", authMiddleware, getUserData);

router.post("/", authMiddleware, postUserData);

router.get("/blogs", authMiddleware, getUsersBlogs);

module.exports = router;
