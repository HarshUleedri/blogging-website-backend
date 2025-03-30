const express = require("express");

const router = express.Router();
const upload = require("../../middleware/uploadImageMiddleware");

const {
  uploadImage,
} = require("../../controllers/uploadImage/uploadImageControllers");

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
