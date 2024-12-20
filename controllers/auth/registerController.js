const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userSchema");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      const message =
        field === "email"
          ? "The email is already used"
          : "The username is already taken";
      return res.status(400).json({ field, message });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(200).json({
      message: "user is sucessfully register",
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
