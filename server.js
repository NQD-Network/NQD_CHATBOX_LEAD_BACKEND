require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const validateEnv = require("./src/config/validateEnv");
const logger = require("./src/middleware/logger");
const rateLimiter = require("./src/middleware/rateLimiter");

// Validate environment variables
validateEnv();

// Import routes
const sessionRoutes = require("./src/routes/sessionRoutes");
const leadRoutes = require("./src/routes/leadRoutes");
const addTenantRoutes = require("./src/routes/addTenantRoutes");

const app = express();

// Trust proxy - important for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['*'];

const corsOptions = {
  origin: allowedOrigins[0] === '*' ? '*' : (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Security and logging middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - apply to all routes
app.use(rateLimiter(100, 60000)); // 100 requests per minute

// Connect to DB
connectDB();

// Routes
app.use("/api/session", sessionRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/kratos/add-tenant", addTenantRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation'
    });
  }

  // Payload too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Request payload too large'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS: ${allowedOrigins[0] === '*' ? 'All origins (not recommended for production)' : allowedOrigins.join(', ')}`);
});
