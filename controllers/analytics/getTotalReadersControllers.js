const Blog = require("../../models/Blogs");
const User = require("../../models/userSchema");

exports.getTotalReaders = async (req, res) => {
  try {
    const { timeframe } = req.query;

    const { id } = req.user;
    if (!id) return res.status(400).json({ message: "authorized" });

    const user = await User.findOne({ _id: id });

    if (!user) return res.status(404).json({ message: "User Not Found" });

    if (timeframe === "week") {
      const lastWeekReaders = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$viewsLog" },
        {
          $match: {
            "viewsLog.viewedAt": {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$viewsLog.viewedAt" },
            },
            totalReaders: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReaders: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastWeekReaders });
    }
    if (timeframe === "month") {
      const lastMonthReaders = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$viewsLog" },
        {
          $match: {
            "viewsLog.viewedAt": {
              $gte: new Date(new Date().setDate(new Date().getDate() - 31)),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$viewsLog.viewedAt" },
            },
            totalReaders: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReaders: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastMonthReaders });
    }
    if (timeframe === "year") {
      const lastYearReaders = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$viewsLog" },
        {
          $match: {
            "viewsLog.viewedAt": {
              $gte: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$viewsLog.viewedAt" },
            },
            totalReaders: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReaders: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ lastYearReaders });
    }
    if (timeframe === "infinity") {
      const fromStartReaders = await Blog.aggregate([
        { $match: { author: user._id } },
        { $unwind: "$viewsLog" },
        {
          $match: {
            "viewsLog.viewedAt": {
              $gte: new Date(user.createdAt),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$viewsLog.viewedAt" },
            },
            totalReaders: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalReaders: 1,
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]);

      res.status(200).json({ fromStartReaders });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
