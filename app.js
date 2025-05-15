var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const connectDB = require("./config/db");
const blogRouter = require("./routes/BlogsRoutes/blogRoutes");
const registerRouter = require("./routes/authRoutes");
const UserBookmarkRouter = require("./routes/UserBookmarkRoutes/UserBookmarkRoutes");
const UserReactionRouter = require("./routes/UserReactionsRouters/UserReactionsRouters");
const UserComments = require("./routes/UserComments/UserComments");
const UserCommentsReaction = require("./routes/UserComments/UserCommentsReaction");
const uploadImage = require("./routes/UploadImageRoutes/UploadImageRoute");
const uploadCoverImage = require("./routes/UploadImageRoutes/UploadCoverImageRoute");
const userData = require("./routes/UserDataRoutes//UserDataRoutes");
const uploadUserProfileImage = require("./routes/UploadImageRoutes/uploadUserImageRoute");
const UserFollow = require("./routes/UserFollowRoutes/UserFollowRoutes");
const UserFollowers = require("./routes/UserFollowRoutes/UserFollowers");
const UserFollowings = require("./routes/UserFollowRoutes/UserFollowing");
const usersBlogsComments = require("./routes/UserComments/UsersAllBlogsComments");
const UserCommentsAnalytics = require("./routes/AnalyticsRoutes/AnalyticsRoutes");
const UserBlogReaderAnalytics = require("./routes/AnalyticsRoutes/ReaderAnalyticsRoutes");
const UserBlogReactionAnalytics = require("./routes/AnalyticsRoutes/ReactionAnalytics");
const SearchBlog = require("./routes/Search/Search");
const authMiddleware = require("./middleware/authMiddleware");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/blogs", blogRouter);
app.use("/api", registerRouter);
app.use("/api/blog", UserBookmarkRouter);
app.use("/api/blog", UserReactionRouter);
app.use("/api/comments", UserComments);

app.use("/api/comments/reaction", UserCommentsReaction);
app.use("/api/upload/image", uploadImage);
app.use("/api/upload/cover-image", uploadCoverImage);

app.use("/api/user", userData);
app.use("/api/user/upload", uploadUserProfileImage);
app.use("/api/user/follow", UserFollow);
app.use("/api/user/followers", UserFollowers);
app.use("/api/user/following", UserFollowings);
app.use("/api/user/comments/user-blogs", usersBlogsComments);
app.use("/api/user/comments/analytics", UserCommentsAnalytics);
app.use("/api/user/reader/analytics", UserBlogReaderAnalytics);
app.use("/api/user/reaction/analytics", UserBlogReactionAnalytics);
app.use("/api/search", SearchBlog);

module.exports = app;
