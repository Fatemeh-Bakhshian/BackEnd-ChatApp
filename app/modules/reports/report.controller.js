const fs = require("fs");

const reports = JSON.parse(fs.readFileSync(`${__dirname}/reportlist.json`));

exports.getReport = (req, res) => {
  res.status(200).json({
    status: "success",
    results: reports.length,
    data: {
      reports,
    },
  });
};
