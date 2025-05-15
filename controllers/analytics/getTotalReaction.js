const Blog = require("../../models/Blogs");
const User = require("../../models/userSchema");
exports.getTotalReaction = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const { id } = req.user;
    if (!id) return res.status(400).json({ message: "unauthorized" });

    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ message: "User is not found" });

    if (timeframe === "week") {
      const lastWeekReactions = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$userReacted" },
        {
          $match: {
            "userReacted.reactedAt": {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$userReacted.reactedAt",
              },
            },
            totalReactions: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReactions: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastWeekReactions });
    }
    if (timeframe === "month") {
      const lastMonthReactions = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$userReacted" },
        {
          $match: {
            "userReacted.reactedAt": {
              $gte: new Date(new Date().setDate(new Date().getDate() - 31)),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$userReacted.reactedAt",
              },
            },
            totalReactions: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReactions: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastMonthReactions });
    }
    if (timeframe === "year") {
      const lastYearReactions = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$userReacted" },
        {
          $match: {
            "userReacted.reactedAt": {
              $gte: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$userReacted.reactedAt",
              },
            },
            totalReactions: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReactions: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastYearReactions });
    }
    if (timeframe === "infinity") {
      const lastYearReactions = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$userReacted" },
        {
          $match: {
            "userReacted.reactedAt": {
              $gte: new Date(user.createdAt),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$userReacted.reactedAt",
              },
            },
            totalReactions: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReactions: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastYearReactions });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }

  return;
};
