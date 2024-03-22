const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
const { authenticateUser, authorizeAdmin } = require("../middlewares/isLoggedIn");

// Route to handle POST request to create a new user
router.post("/", authenticateUser, authorizeAdmin, UserController.createUser);

// Route to get all users
router.get("/", authenticateUser, authorizeAdmin, UserController.getAllUsers);

// Route to get a single user
router.get("/:id", authenticateUser, authorizeAdmin, UserController.getUserById);

module.exports = router;
