require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const connectMongoDB = require("./loaders/db");
const { RESPONSE } = require("./constants");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const diaryRouter = require("./routes/diary");

const app = express();

connectMongoDB();

app.use(logger("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/diaries", diaryRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);

  if (req.app.get("env") === "development") {
    res.json({
      result: err.result || RESPONSE.ERROR,
      message: err.message,
      stack: err.stack,
    });

    return;
  }

  if (err.statusCode === 500) {
    err.message = "Internal Server Error";
  }

  res.json({
    result: err.result || RESPONSE.ERROR,
    message: err.message,
  });
});

module.exports = app;
