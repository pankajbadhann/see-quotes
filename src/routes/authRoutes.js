const express = require("express");
const router = express.Router();


const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts, try again later",
});

const { validateRegister, validateLogin, } = require("../validations/authValidation");

// LOGIN
router.get("/login", authController.showLogin);
router.post("/login", authLimiter, validateLogin, authController.loginUser);

// REGISTER
router.get("/register", authController.showRegister);
router.post("/register", authLimiter, validateRegister, authController.registerUser);

// LOGOUT
router.get("/logout", authController.logoutUser);

module.exports = router;