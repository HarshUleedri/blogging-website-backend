const express = require("express");
const router = express.Router();

const upload = require("../../middleware/uploadUserImageMiddleware");
const {
  addUserImage,
} = require("../../controllers/uploadImage/uploadUserImageController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/profile-image",  upload.single("profileImage"), addUserImage),
  (module.exports = router);
