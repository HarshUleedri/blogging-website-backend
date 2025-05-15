const Blog = require("../../models/Blogs");
const Comments = require("../../models/Comments");
const User = require("../../models/userSchema");

exports.getTotalComments = async (req, res) => {
  try {
    const { timeframe } = req.query;

    if (!timeframe)
      return res.status(400).json({ message: "timeframe is required" });

    const { id } = req.user;
    if (!id) return res.status(400).json({ message: "authorized" });

    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const blogs = await Blog.find({ author: user._id });
    if (!blogs) return res.status(404).json({ message: "Blog Not Found" });

    const allComments = await Promise.all(
      blogs.map(async (blog) => {
        const comments = await Comments.find({ blogId: blog._id });
        return comments;
      })
    );

    // const latestComments = allComments
    //   .flat()
    //   .filter(
    //     (comment) =>
    //       comment.createdAt >=
    //       new Date(new Date().setDate(new Date().getDate() - 7))
    //   )
    //   .reduce((acc, crr) => {
    //     const commentDate = new Date(crr.createdAt).toISOString().split("T")[0];

    //     // Find if this date already exists in accumulator
    //     let existingEntry = acc.find((entry) => entry.date === commentDate);

    //     if (existingEntry) {
    //       existingEntry.total += 1; // Increment count if date exists
    //     } else {
    //       acc.push({ date: commentDate, total: 1 }); // Add new entry
    //     }

    //     return acc;
    //   }, []);

    if (timeframe === "week") {
      const lastWeeksComments = await Comments.aggregate([
        {
          $match: {
            userId: user._id,
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalComments: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalComments: 1,
            _id: 0,
          },
        },
        { $sort: { date: -1 } },
      ]);

      return res.status(200).json({ lastWeeksComments });
    }
    if (timeframe === "month") {
      const lastMonthComments = await Comments.aggregate([
        {
          $match: {
            userId: user._id,
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 31)),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalComments: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalComments: 1,
            _id: 0,
          },
        },
        { $sort: { date: -1 } },
      ]);

      return res.status(200).json({ lastMonthComments });
    }
    if (timeframe === "year") {
      const lastYearComments = await Comments.aggregate([
        {
          $match: {
            userId: user._id,
            createdAt: {
              $gte: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
              ),
            },
          },
        },
        {
          $group:  {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            totalComments: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalComments: 1,
            _id: 0,
          },
        },
        { $sort: { date: -1 } },
      ]);

      return res.status(200).json({ lastYearComments });
    }
    if (timeframe === "infinite") {
      const lastMonthComments = await Comments.aggregate([
        {
          $match: {
            userId: user._id,
            createdAt: {
              $gte: new Date(user.createdAt),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalComments: { $sum: 1 },
          },
        },
        {
          $project: {
            date: "$_id",
            totalComments: 1,
            _id: 0,
          },
        },
        { $sort: { date: -1 } },
      ]);

      return res.status(200).json({ lastMonthComments });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
