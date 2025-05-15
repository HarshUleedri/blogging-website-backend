const User = require("../../models/userSchema");

exports.userFollowToggle = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "User is Required" });

    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "User is Required To follow" });

    const currentUser = await User.findOne({ _id: id });

    if (!currentUser)
      return res.status(404).json({ message: "User Not Found " });

    const userToFollow = await User.findOne({ _id: userId });

    if (!userToFollow)
      return res.status(404).json({ message: "User Not Found " });

    const userIsFollowing = currentUser.following.some(
      (userId) => userId.toString() === userToFollow._id.toString()
    );

    if (userIsFollowing) {
      currentUser.following = currentUser.following.filter(
        (userId) => userId.toString() !== userToFollow._id.toString()
      );
      await currentUser.save();

      userToFollow.followers = userToFollow.followers.filter(
        (userId) => userId.toString() !== currentUser._id.toString()
      );
      await userToFollow.save();

      return res.status(200).json({ isFollowing: false });
    } else {
      currentUser.following.push(userToFollow._id);
      await currentUser.save();

      userToFollow.followers.push(currentUser._id);
      await userToFollow.save();
      return res.status(200).json({ isFollowing: true });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "server error" });
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "User Id Not Found " });

    const user = await User.findOne({ _id: id }).populate("followers");

    if (!user) return res.status(404).json({ message: "User Not Found" });

    return res.status(200).json({ followers: user.followers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};

exports.getUserFollowings = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "User Id Is Not Found" });

    const user = await User.findOne({ _id: id }).populate("following");
    if (!user) return res.status(404).json({ message: " User Is Not Found" });

    return res.status(200).json({ followings: user.following });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};
