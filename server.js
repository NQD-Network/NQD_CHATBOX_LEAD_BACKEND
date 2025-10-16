require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");

// Import routes
const sessionRoutes = require("./src/routes/sessionRoutes");
const leadRoutes = require("./src/routes/leadRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/session", sessionRoutes);
app.use("/api/leads", leadRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
