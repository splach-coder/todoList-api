const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const xss = require("xss");
const CryptoJS = require("crypto-js");

// Controller function for user signup
const signup = async (req, res) => {
  // Validate input using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize input using xss
  const { username, email, password } = req.body;

  const sanitizedUsername = xss(username);
  const sanitizedEmail = xss(email);
  const sanitizedPassword = xss(password);

  try {
    // Check if email is unique
    const existingUser = await User.findOne({ email: sanitizedEmail });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    // Create new user
    const newUser = new User({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    // Encrypt the data using AES encryption with the secret key
    const encryptedData = CryptoJS.AES.encrypt(
      token,
      process.env.CRYPTO_SECRET
    ).toString();

    // Add the token to the user object
    newUser.token = encryptedData;

    await newUser.save();

    res.status(200).json({ message: "signup successfully", token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Error signing up user" });
  }
};

// Controller function for user login
const login = async (req, res) => {
  // Validate input using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitize input using xss
  const { email, password } = req.body;

  const sanitizedEmail = xss(email);
  const sanitizedPassword = xss(password);

  try {
    // Find user by email
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(
      sanitizedPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Encrypt the data using AES encryption with the secret key
    const encryptedData = CryptoJS.AES.encrypt(
      token,
      process.env.CRYPTO_SECRET
    ).toString();

    // Find the user by ID and update the token field
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { token: encryptedData } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Respond with token
    res.status(200).json({ message: "Login Successfull", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

const logout = async (req, res) => {
  // Clear JWT token from client-side storage (local storage, session storage, cookies, etc.)
  // Redirect the user to the login page or any other appropriate action
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { login, signup, logout };
