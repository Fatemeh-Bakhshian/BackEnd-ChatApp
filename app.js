const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors({
  origin: ["http://localhost:5173"]
}));

const users = JSON.parse(fs.readFileSync("app/modules/users/userlist.json"));
const reports = JSON.parse(fs.readFileSync("app/modules/reports/reportlist.json"));

app.get("/api/users", (req, res) => {

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

app.get("/api/reports", (req, res) => {

  res.status(200).json({
    status: "success",
    results: reports.length,
    data: {
      reports,
    },
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
