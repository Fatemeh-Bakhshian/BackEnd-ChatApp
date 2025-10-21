const express = require("express");
const cors = require("cors");


const userRouter = require("./app/modules/users/user.routes");
const reportRouter = require("./app/modules/reports/report.routes");
const authRouter = require("./app/modules/authenticate/auth.routes");

const app = express();

app.use(express.json());

//ایا اینو باید تو فایل config بزارم؟
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/auth", authRouter);


module.exports = app;
