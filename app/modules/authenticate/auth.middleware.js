const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
  max: 5,
  windowMs: 10 * 60 * 1000,
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
