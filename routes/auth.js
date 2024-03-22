const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");
const validationRules = require("../middlewares/auth");

// Route to handle user signup
router.post(
  "/signup",
  validationRules.signupValidationRules,
  userController.signup
);

// Route to handle user login
router.post(
  "/login",
  validationRules.loginValidationRules,
  userController.login
);

// Logout route
router.post("/logout", userController.logout);

module.exports = router;
