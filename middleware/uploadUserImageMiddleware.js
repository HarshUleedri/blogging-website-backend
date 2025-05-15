const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./Uploads/UserProfileImages");
  },
  filename: function (req, file, cd) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cd(null, uniqueName);
  },
});

const fileFilter = (req, file, cd) => {
  const fileExtention = path.extname(file.originalname);

  if (allowedExtensions.includes(fileExtention)) {
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
  filter: fileFilter,
});

module.exports = upload;
