const AJV = require("ajv");

const ajv = new AJV({ coerceTypes: true, allErrors: true });

exports.validateReportId = (schema) => {
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.params);
    if (!valid) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid report ID :( ",
      });
    }
    next();
  };
};
