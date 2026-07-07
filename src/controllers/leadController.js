const axios = require("axios");
const { updateLead } = require("../services/leadService");
const {
  isValidObjectId,
  validateLeadData,
  sanitizeLeadData
} = require("../utils/validation");

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/lead";

exports.submitLead = async (req, res) => {
  try {
    const { service, message, name, email, phone, bestTime, sessionId } =
      req.body;

    // Validate sessionId
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Missing sessionId",
        field: "sessionId"
      });
    }

    if (!isValidObjectId(sessionId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid sessionId format",
        field: "sessionId"
      });
    }

    // Prepare and sanitize lead data
    const leadData = sanitizeLeadData({
      service,
      message,
      name,
      email,
      phone,
      bestTime
    });

    // Validate lead data
    const validation = validateLeadData(leadData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.errors
      });
    }

    // Update lead in database
    const lead = await updateLead(sessionId, leadData);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    // Send data to N8N webhook with timeout
    try {
      await axios.post(N8N_WEBHOOK_URL, lead, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.warn("⚠️ Failed to POST to n8n webhook:", err.message);
      // Don't fail the request if webhook fails
    }

    res.json({ success: true, lead });
  } catch (err) {
    console.error("Submit lead error:", err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
