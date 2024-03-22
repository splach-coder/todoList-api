const { body } = require("express-validator");

const validationRules = {
  loginValidationRules: [
    body("email").trim().isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  
  signupValidationRules: [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").trim().isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
};

module.exports = validationRules;
