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
const authMiddleware = require("./middleware/authMiddleware");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

connectDB();

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/blogs", blogRouter);
app.use("/api", registerRouter);
app.use("/api/blog", UserBookmarkRouter);
app.use("/api/blog", UserReactionRouter);
app.use("/api/comments", UserComments);

module.exports = app;
