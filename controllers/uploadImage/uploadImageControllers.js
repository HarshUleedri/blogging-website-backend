exports.uploadImage = (req, res) => {
  try {
    const image = req.file;

    if (!image) return res.status(404).json({ message: "Image Is Not send" });

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/images/${
      req.file.filename
    }`;
    setTimeout(() => {
      return res.status(200).json({ url: imageUrl });
    }, 2000);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// https://chatgpt.com/share/67dc6288-b480-8012-a64a-ec6362b5cf13
