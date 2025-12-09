const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("uncaughtException ! 💥 shuting down ... ");
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
// .replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION ! 💥 shuting down ... ");
  server.close(() => {
    process.exit(1);
  });
});
