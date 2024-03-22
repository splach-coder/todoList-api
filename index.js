// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
require('dotenv').config()
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(helmet());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://anasbenbow123:idYI14TeKNoHbpsg@cluster0.nwu9wgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
