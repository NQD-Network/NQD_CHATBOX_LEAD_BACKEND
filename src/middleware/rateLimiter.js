// Simple in-memory rate limiter
// For production, consider using redis-based rate limiting

const requestCounts = new Map();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > 600000) { // 10 minutes
      requestCounts.delete(key);
    }
  }
}, 600000);

/**
 * Rate limiter middleware
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    let requestData = requestCounts.get(ip);

    if (!requestData || now > requestData.resetTime) {
      // Initialize or reset counter
      requestData = {
        count: 1,
        resetTime: now + windowMs
      };
      requestCounts.set(ip, requestData);
      return next();
    }

    if (requestData.count >= maxRequests) {
      const timeUntilReset = Math.ceil((requestData.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: timeUntilReset
      });
    }

    requestData.count++;
    next();
  };
};

module.exports = rateLimiter;
