exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    return next(error);
  }

  if (username.trim().length < 3) {
    const error = new Error(
      "Username must be at least 3 characters"
    );
    error.statusCode = 400;
    return next(error);
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    const error = new Error(
      "Please enter a valid email address"
    );
    error.statusCode = 400;
    return next(error);
  }

  if (password.length < 6) {
    const error = new Error(
      "Password must be at least 6 characters"
    );
    error.statusCode = 400;
    return next(error);
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error(
      "Email and password are required"
    );
    error.statusCode = 400;
    return next(error);
  }

  next();
};