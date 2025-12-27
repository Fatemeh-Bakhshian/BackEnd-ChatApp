const express = require("express");
const cors = require("cors");

const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const globalErrorHandler = require("./app/config/errorController");
const AppErorr = require("./app/utils/appError");

const userRouter = require("./app/modules/users/user.routes");
const reportRouter = require("./app/modules/reports/report.routes");
const authRouter = require("./app/modules/authenticate/auth.routes");
const commentRouter = require("./app/modules/comment/comment.routes");
const LikeRouter = require("./app/modules/like/like.routes");

const app = express();

app.use(express.json());

//ایا اینو باید تو فایل config بزارم؟
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Global middleware:

// 1) HELMET for set security headers
app.use(helmet());

// 2) MORGAN for having beeters logs for our errors and outPuts
console.log(process.env.NODE_ENV);

if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}

// 3) EXPRESS-RATE-LIMIT for limitting to maney req form 1 ip
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// body parser : reading the data from body into req.body
app.use(express.json({ limit: "10kb" }));

// serving static files
app.use(express.static(`${__dirname}/public`));

//testing middleware
app.use((req, res, next) => {
  console.log("hello from the MIDDLEWARE :)");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log("headers =>" , req.headers)
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", LikeRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppErorr(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
