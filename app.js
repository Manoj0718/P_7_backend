const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const DB = require("./module/models");

//*--------Database connect----------- ////

DB.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
});
//*-----------------------------------------------------//

const indexRouter = require("./routes/index");
const postRouter = require("./routes/postRotes");
const commentRouter = require("./routes/comments_Routes");

const app = express();

//*------------CORS Header ------------------//

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//*-----------------------------------------------------//
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth/", indexRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

module.exports = app;
