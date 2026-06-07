const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../validations/authValidation");

// REGISTER
router.get("/register", authController.showRegister);

router.post(
  "/register",
  validateRegister,
  authController.registerUser
);

// LOGIN
router.get("/login", authController.showLogin);

router.post(
  "/login",
  validateLogin,
  authController.loginUser
);

// LOGOUT
router.get("/logout", authController.logoutUser);

module.exports = router;