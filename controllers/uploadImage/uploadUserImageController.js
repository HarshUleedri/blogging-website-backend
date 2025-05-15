exports.addUserImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/userProfileImages/${req.file.filename}`;

    if (!imageUrl)
      return res.status(400).json({ message: "Image Url required" });

    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
