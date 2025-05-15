const User = require("../../models/userSchema");

exports.getUserData = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) return res.status(400).json({ message: "User Id Not Found" });

    const user = await User.findOne({ _id: id }).populate("bookmarks");

    if (!user) return res.status(404).json({ message: "User Not Found " });

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.postUserData = async (req, res) => {
  try {
    const {
      name,
      bio,
      location,
      username,
      email,
      skills,
      profileImage,
      brandColor,
    } = req.body;

    if (!Object.keys(req.body).length) {
      res.status(400).json({ message: "No Data Is Provide For Update" });
    }

    const updateValue = {
      name,
      bio,
      location,
      username,
      email,
      skills,
      profileImage,
      brandColor,
    };

    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "User Id Required" });

    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateValue },
      {
        new: true,
      }
    );

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
