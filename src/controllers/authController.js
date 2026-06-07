const bcrypt = require("bcrypt");
const User = require("../models/User");

// Show Register Page
exports.showRegister = (req, res) => {
  res.render("auth/register");
};

// Show Login Page
exports.showLogin = (req, res) => {
  res.render("auth/login");
};

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    await User.create({
      username,
      email,
      password,
    });

    return res.redirect("/login");
  } catch (err) {
    next(err);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.redirect("/posts");
  } catch (err) {
    next(err);
  }
};

// Logout User
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};