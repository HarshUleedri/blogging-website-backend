const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blog-cover-image");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cd) => {
  const extensionName = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extensionName)) {
    cd(null, true);
  } else {
    cd(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed!"
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
