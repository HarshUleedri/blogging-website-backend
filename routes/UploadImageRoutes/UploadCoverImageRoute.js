const express = require("express");

const router = express.Router();
const upload = require("../../middleware/UploadBlogCoverImageMiddleware");

const {
  uploadCoverImage,
} = require("../../controllers/uploadImage/uploadCoverImageController");

router.post("/", upload.single("coverImage"), uploadCoverImage);

module.exports = router;
