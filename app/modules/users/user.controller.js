const fs = require("fs");

const users = JSON.parse(fs.readFileSync(`${__dirname}/userlist.json`));

exports.getUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};
