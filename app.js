var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const connectDB = require("./config/db");
const blogRouter = require("./routes/blogRoutes");
const registerRouter = require("./routes/authRoutes");

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

module.exports = app;
