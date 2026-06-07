const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  console.error("ERROR LOG:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  // API-style structured response (even for EJS apps)
  return res.status(statusCode).render("error", {
    message,
    statusCode,
    user: req.session?.user || null,
  });
};