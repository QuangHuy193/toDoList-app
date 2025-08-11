const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

app.use("/task", taskRoutes);

module.exports = app;
